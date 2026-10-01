import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class ScreenshotHappyApi implements ICredentialType {
	name = 'screenshotHappyApi';

	displayName = 'Screenshot Happy API';

	icon: Icon = 'file:../nodes/ScreenshotHappy/screenshotHappy.svg';

	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased -- this rule runs the URL VALUE through camelCase(); applying its autofix would mangle this real, working docs link (e.g. 'screenshot-api-production-ffd7' -> 'screenshotApiProductionFfd7'). Keeping the functional URL instead, matching other n8n community nodes' documented handling of this same finding.
	documentationUrl = 'https://screenshot-api-production-ffd7.up.railway.app/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Get a free key at https://screenshot-api-production-ffd7.up.railway.app/ ("Get a free key"). Sent as the x-api-key header on every request.',
		},
	];

	// Screenshot Happy authenticates every request with a static x-api-key
	// header (see /docs). n8n injects this automatically on every request
	// made through this credential.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	// Cheapest real call that requires a valid key: a 1x1-viewport PNG of
	// example.com. A bad/missing key returns 401 per the documented error
	// contract, which n8n's credential tester treats as a failed test.
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://screenshot-api-production-ffd7.up.railway.app',
			url: '/screenshot',
			method: 'GET',
			qs: {
				url: 'https://example.com',
				width: 200,
				height: 200,
			},
		},
	};
}
