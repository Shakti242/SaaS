'use server'
import { Option } from '@/components/ui/multiple-selector'
import { db } from '@/lib/db'
import { auth, currentUser } from '@clerk/nextjs'

export const getGoogleListener = async () => {
  const { userId } = auth()

  if (userId) {
    const listener = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        googleResourceId: true,
      },
    })

    if (listener) return listener
  }
}

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  try {
    const published = await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        publish: state,
      },
    })

    return published.publish ? 'Workflow published' : 'Workflow unpublished'
  } catch (error) {
    console.error('Error publishing workflow:', error)
    throw new Error('Failed to publish workflow')
  }
}

export const onCreateNodeTemplate = async (
  content: string,
  type: string,
  workflowId: string,
  channels?: Option[],
  accessToken?: string,
  notionDbId?: string
) => {
  try {
    if (type === 'Discord') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          discordTemplate: content,
        },
      })

      return response ? 'Discord template saved' : 'Failed to save Discord template'
    }

    if (type === 'Slack') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          slackTemplate: content,
          slackAccessToken: accessToken,
        },
      })

      if (response) {
        const channelList = await db.workflows.findUnique({
          where: {
            id: workflowId,
          },
          select: {
            slackChannels: true,
          },
        })

        if (channelList) {
          // Remove duplicates before inserting
          const NonDuplicated = channelList.slackChannels.filter(
            (channel) => channel !== channels![0].value
          )

          await Promise.all(
            NonDuplicated.map(async (channel) => {
              await db.workflows.update({
                where: {
                  id: workflowId,
                },
                data: {
                  slackChannels: {
                    push: channel,
                  },
                },
              })
            })

          )

          await Promise.all(
            channels!.map(async (channel) => {
              await db.workflows.update({
                where: {
                  id: workflowId,
                },
                data: {
                  slackChannels: {
                    push: channel.value,
                  },
                },
              })
            })
          )

          return 'Slack template saved'
        }
      }
    }

    if (type === 'Notion') {
      const response = await db.workflows.update({
        where: {
          id: workflowId,
        },
        data: {
          notionTemplate: content,
          notionAccessToken: accessToken,
          notionDbId: notionDbId,
        },
      })

      return response ? 'Notion template saved' : 'Failed to save Notion template'
    }
  } catch (error) {
    console.error('Error creating node template:', error)
    throw new Error('Failed to create node template')
  }
}

export const onGetWorkflows = async () => {
  try {
    const user = await currentUser()
    if (user) {
      const workflows = await db.workflows.findMany({
        where: {
          userId: user.id,
        },
      })

      return workflows
    }
    throw new Error('User not authenticated')
  } catch (error) {
    console.error('Error fetching workflows:', error)
    throw new Error('Failed to fetch workflows')
  }
}

export const onCreateWorkflow = async (name: string, description: string) => {
  try {
    const user = await currentUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    const existingUser = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
    })

    if (!existingUser) {
      throw new Error('User not found in the database')
    }

    const workflow = await db.workflows.create({
      data: {
        userId: existingUser.clerkId,
        name,
        description,
      },
    })

    console.log('Workflow created successfully:', workflow)
    return { message: 'Workflow created' }
  } catch (error) {
    console.error('Error creating workflow:', error)
    return { message: 'Error creating workflow', error }
  }
}

export const onGetNodesEdges = async (flowId: string) => {
  try {
    const nodesEdges = await db.workflows.findUnique({
      where: {
        id: flowId,
      },
      select: {
        nodes: true,
        edges: true,
      },
    })

    if (nodesEdges?.nodes && nodesEdges?.edges) return nodesEdges
    throw new Error('Nodes and edges not found')
  } catch (error) {
    console.error('Error fetching nodes and edges:', error)
    throw new Error('Failed to fetch nodes and edges')
  }
}
