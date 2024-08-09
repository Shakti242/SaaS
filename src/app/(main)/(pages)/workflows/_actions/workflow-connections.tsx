import { Option } from '@/components/ui/multiple-selector';
import { db } from '@/lib/db';
import { auth, currentUser } from '@clerk/nextjs';

// Fetch the Google listener if the user is authenticated
export const getGoogleListener = async () => {
  const { userId } = auth();

  if (!userId) return null;

  try {
    const listener = await db.user.findUnique({
      where: { clerkId: userId },
      select: { googleResourceId: true },
    });
    return listener ?? null;
  } catch (error) {
    console.error('Error fetching Google listener:', error);
    return null;
  }
};

// Update the publish state of a workflow
export const onFlowPublish = async (workflowId: string, state: boolean) => {
  try {
    const updatedWorkflow = await db.workflows.update({
      where: { id: workflowId },
      data: { publish: state },
    });
    return updatedWorkflow.publish ? 'Workflow published' : 'Workflow unpublished';
  } catch (error) {
    console.error('Error updating workflow publish state:', error);
    return 'Failed to update publish state';
  }
};

// Create or update a node template based on the provided type (Discord, Slack, Notion)
export const onCreateNodeTemplate = async (
  content: string,
  type: 'Discord' | 'Slack' | 'Notion',
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  try {
    if (type === 'Discord') {
      const response = await db.workflows.update({
        where: { id: workflowId },
        data: { discordTemplate: content },
      });
      return response ? 'Discord template saved' : 'Failed to save Discord template';
    }

    if (type === 'Slack') {
      const response = await db.workflows.update({
        where: { id: workflowId },
        data: { slackTemplate: content, slackAccessToken: accessToken },
      });

      if (response) {
        const existingChannels = await db.workflows.findUnique({
          where: { id: workflowId },
          select: { slackChannels: true },
        });

        const newChannels = channels?.map(channel => channel.value) ?? [];
        const nonDuplicatedChannels = [
          ...(existingChannels?.slackChannels ?? []),
          ...newChannels,
        ].filter((value, index, self) => self.indexOf(value) === index);

        await db.workflows.update({
          where: { id: workflowId },
          data: { slackChannels: nonDuplicatedChannels },
        });

        return 'Slack template saved';
      }
      return 'Failed to save Slack template';
    }

    if (type === 'Notion') {
      const response = await db.workflows.update({
        where: { id: workflowId },
        data: {
          notionTemplate: content,
          notionAccessToken: accessToken,
          notionDbId: notionDbId,
        },
      });
      return response ? 'Notion template saved' : 'Failed to save Notion template';
    }

    return 'Unknown template type';
  } catch (error) {
    console.error('Error creating/updating node template:', error);
    return 'Failed to create/update template';
  }
};

// Fetch all workflows associated with the current user
export const onGetWorkflows = async () => {
  const user = await currentUser();

  if (!user) return [];

  try {
    const workflows = await db.workflows.findMany({
      where: { userId: user.id },
    });
    return workflows ?? [];
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return [];
  }
};

// Create a new workflow with the specified name and description
export const onCreateWorkflow = async (name: string, description: string) => {
  const user = await currentUser();

  if (!user) {
    return { message: 'User not authenticated' };
  }

  if (!name || !description) {
    return { message: 'Name and description are required' };
  }

  try {
    console.log('Attempting to create workflow with data:', { userId: user.id, name, description });

    const workflow = await db.workflows.create({
      data: {
        userId: user.id,
        name,
        description,
      },
    });

    return { message: 'Workflow created successfully', workflow };
  } catch (error) {
    console.error('Error creating workflow:', error);
    return { message: 'Failed to create workflow. Please try again.' };
  }
};

// Fetch the nodes and edges of a workflow by its ID
export const onGetNodesEdges = async (flowId: string) => {
  try {
    const nodesEdges = await db.workflows.findUnique({
      where: { id: flowId },
      select: { nodes: true, edges: true },
    });
    return nodesEdges ?? { nodes: [], edges: [] };
  } catch (error) {
    console.error('Error fetching nodes and edges:', error);
    return { nodes: [], edges: [] };
  }
};
