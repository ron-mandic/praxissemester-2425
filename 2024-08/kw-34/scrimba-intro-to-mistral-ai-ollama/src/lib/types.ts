import type {
	AssistantMessage,
	SystemMessage,
	ToolMessage,
	UserMessage
} from '@mistralai/mistralai/models/components';

export type TMessage = (
	| (SystemMessage & {
			role: 'system';
	  })
	| (UserMessage & {
			role: 'user';
	  })
	| (AssistantMessage & {
			role: 'assistant';
	  })
	| (ToolMessage & {
			role: string;
	  })
);
