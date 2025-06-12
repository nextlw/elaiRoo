export function getSharedToolUseSection(): string {
	return `====

TOOL USE

You have access to a set of tools that are executed upon the user's approval. You can use one tool per message, and will receive the result of that tool use in the user's response. You use tools step-by-step to accomplish a given task, with each tool use informed by the result of the previous tool use.

# Tool Use Formatting

Tool uses are formatted using XML-style tags. The tool name itself becomes the XML tag name. Each parameter is enclosed within its own set of tags. Here's the structure:

<actual_tool_name>
<parameter1_name>value1</parameter1_name>
<parameter2_name>value2</parameter2_name>
...
</actual_tool_name>

🚨 CRITICAL XML RULE: Every parameter value MUST be inside proper XML tags. DO NOT put raw text directly inside tool tags.

❌ WRONG (causes "parameter undefined" errors):
<web_search>
search terms without tags    ← This will fail
jina                        ← This will fail
<num_results>10</num_results>
</web_search>

✅ CORRECT (each parameter has its own tags):
<web_search>
<query>search terms without tags</query>
<engine>jina</engine>
<num_results>10</num_results>
</web_search>

For example, to use the new_task tool:

<new_task>
<mode>code</mode>
<message>Implement a new feature for the application.</message>
</new_task>

Always use the actual tool name as the XML tag name for proper parsing and execution.`
}
