import React from 'react';
import Workflow from './workflow';

type Props = {};
const Workflows = (props: Props) => {
  return (
    <div className="relative flex flex-col gap-4">
      <section className="flex flex-col gap-4 p-2">
        <Workflow
          description="Creating a test Workflow"
          id="e23498fj23948n"
          name="Automation Workflow"
          publish={false}
        />
      </section>
    </div>
  );
};
export default Workflows;
