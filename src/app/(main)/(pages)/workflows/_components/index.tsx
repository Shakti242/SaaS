"use client";
import React, { useEffect, useState } from 'react';
import Workflow from './workflow';
import { onGetWorkflows } from '../_actions/workflow-connections';
import MoreCredits from './more_creadits';

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const fetchedWorkflows = await onGetWorkflows();
        console.log("Fetched Workflows before setting state:", fetchedWorkflows);
        setWorkflows(fetchedWorkflows ?? []);
      } catch (error) {
        console.error("Error fetching workflows", error);
        setWorkflows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []); // Added an empty dependency array to run only once

  useEffect(() => {
    console.log("State after setting workflows:", workflows);
  }, [workflows]); // Logs the workflows after they have been updated

  if (loading) {
    return (
      <div className="mt-28 flex text-muted-foreground items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col m-2">
        <MoreCredits />
        {workflows.length ? (
          workflows.map((flow) => (
            <Workflow
              key={flow.id}
              {...flow}
            />
          ))
        ) : (
          <div className="mt-28 flex text-muted-foreground items-center justify-center">
            No Workflows
          </div>
        )}
      </section>
    </div>
  );
}

export default Workflows;
