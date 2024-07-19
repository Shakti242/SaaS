'use client'
import { Button } from '@/components/ui/button'
import { useNodeConnections } from '@/providers/connections-provider'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { onFlowPublish } from '../../../_actions/workflow-connections'
import { toast } from 'sonner'
import { onCreateNodesEdges } from '../_actions/workflow-connections'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const pathname = usePathname()
  const [isFlow, setIsFlow] = useState([])
  const { nodeConnection } = useNodeConnections()

  const onFlowAutomation = useCallback(async () => {
    try {
      console.log('Flow Automation called')
      const path = pathname.split('/').pop()!
      const nodesStr = JSON.stringify(nodes)
      const edgesStr = JSON.stringify(edges)
      const isFlowStr = JSON.stringify(isFlow)

      console.log('Path:', path)
      console.log('Nodes:', nodesStr)
      console.log('Edges:', edgesStr)
      console.log('IsFlow:', isFlowStr)

      const flow = await onCreateNodesEdges(path, nodesStr, edgesStr, isFlowStr)

      if (flow) toast.message(flow.message)
    } catch (error) {
      console.error('Error in onFlowAutomation:', error)
    }
  }, [nodeConnection])

  const onPublishWorkflow = useCallback(async () => {
    try {
      const response = await onFlowPublish(pathname.split('/').pop()!, true)
      if (response) toast.message(response)
    } catch (error) {
      console.error('Error in onPublishWorkflow:', error)
    }
  }, [])

  const onAutomateFlow = async () => {
    const flows: any = []
    const connectedEdges = edges.map((edge) => edge.target)
    connectedEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type)
        }
      })
    })

    setIsFlow(flows)
  }

  useEffect(() => {
    onAutomateFlow()
  }, [edges])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button
          onClick={onFlowAutomation}
          disabled={isFlow.length < 1}
        >
          Save
        </Button>
        <Button
          disabled={isFlow.length < 1}
          onClick={onPublishWorkflow}
        >
          Publish
        </Button>
      </div>
      {children}
    </div>
  )
}

export default FlowInstance
