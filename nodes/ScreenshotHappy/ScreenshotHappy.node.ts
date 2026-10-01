import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

const BASE_URL = 'https://screenshot-api-production-ffd7.up.railway.app';

export class ScreenshotHappy implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Screenshot Happy',
		name: 'screenshotHappy',
		icon: 'file:screenshotHappy.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Capture screenshots, generate PDFs and manage website change-monitoring with Screenshot Happy',
		defaults: {
			name: 'Screenshot Happy',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'screenshotHappyApi',
				required: true,
			},
		],
		properties: [
			// ---------------------------------------------------------------
			// Resource
			// ---------------------------------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Screenshot', value: 'screenshot' },
					{ name: 'Monitor', value: 'monitor' },
				],
				default: 'screenshot',
			},

			// ---------------------------------------------------------------
			// Operations — Screenshot
			// ---------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['screenshot'] } },
				options: [
					{
						name: 'Take Screenshot',
						value: 'takeScreenshot',
						description: 'Capture the viewport as PNG or JPEG',
						action: 'Take a screenshot',
					},
					{
						name: 'Take Full Page Screenshot',
						value: 'takeFullPageScreenshot',
						description: 'Capture the entire scrollable page as PNG or JPEG',
						action: 'Take a full page screenshot',
					},
					{
						name: 'Generate PDF',
						value: 'generatePdf',
						description: 'Render the page as a PDF, exactly as it looks on screen',
						action: 'Generate a PDF',
					},
				],
				default: 'takeScreenshot',
			},

			// ---------------------------------------------------------------
			// Operations — Monitor
			// ---------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['monitor'] } },
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Start monitoring a URL for visual changes',
						action: 'Create a monitor',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'List your monitors',
						action: 'Get many monitors',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Stop monitoring a URL',
						action: 'Delete a monitor',
					},
				],
				default: 'create',
			},

			// ---------------------------------------------------------------
			// Shared: URL (screenshot + monitor create)
			// ---------------------------------------------------------------
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				required: true,
				displayOptions: {
					show: {
						resource: ['screenshot'],
						operation: ['takeScreenshot', 'takeFullPageScreenshot', 'generatePdf'],
					},
				},
				description: 'The page to capture. Must be http/https; private/internal hosts are rejected.',
			},

			// ---------------------------------------------------------------
			// Screenshot: additional fields (per resource docs — /docs #parameters)
			// ---------------------------------------------------------------
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['screenshot'],
						operation: ['takeScreenshot', 'takeFullPageScreenshot'],
					},
				},
				options: [
					{
						displayName: 'CSS Selector',
						name: 'selector',
						type: 'string',
						default: '',
						placeholder: '#pricing-table',
						description: 'Capture only the element matching this selector, instead of the whole viewport/page',
					},
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{ name: 'PNG', value: 'png' },
							{ name: 'JPEG', value: 'jpeg' },
						],
						default: 'png',
					},
					{
						displayName: 'Height (Px)',
						name: 'height',
						type: 'number',
						typeOptions: { minValue: 200, maxValue: 2560 },
						default: 800,
					},
					{
						displayName: 'JPEG Quality',
						name: 'quality',
						type: 'number',
						typeOptions: { minValue: 1, maxValue: 100 },
						default: 80,
						description: 'Only applies when Format is JPEG',
					},
					{
						displayName: 'Width (Px)',
						name: 'width',
						type: 'number',
						typeOptions: { minValue: 200, maxValue: 2560 },
						default: 1280,
					},
				],
			},
			{
				displayName: 'Options',
				name: 'pdfOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['screenshot'],
						operation: ['generatePdf'],
					},
				},
				options: [
					{
						displayName: 'Full Page',
						name: 'full_page',
						type: 'boolean',
						default: false,
						description: 'Whether to size the PDF to the whole scrollable page instead of one viewport-sized page',
					},
					{
						displayName: 'Width (Px)',
						name: 'width',
						type: 'number',
						typeOptions: { minValue: 200, maxValue: 2560 },
						default: 1280,
					},
					{
						displayName: 'Height (Px)',
						name: 'height',
						type: 'number',
						typeOptions: { minValue: 200, maxValue: 2560 },
						default: 800,
					},
				],
			},
			{
				displayName: 'Put Output File in Field',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				displayOptions: {
					show: {
						resource: ['screenshot'],
						operation: ['takeScreenshot', 'takeFullPageScreenshot', 'generatePdf'],
					},
				},
				description: 'Name of the binary property the image/PDF is written to',
			},

			// ---------------------------------------------------------------
			// Monitor: Create
			// ---------------------------------------------------------------
			{
				displayName: 'URL',
				name: 'monitorUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/pricing',
				required: true,
				displayOptions: { show: { resource: ['monitor'], operation: ['create'] } },
				description: 'The page to check for visual changes on a schedule',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				placeholder: 'https://your-server.com/webhook',
				required: true,
				displayOptions: { show: { resource: ['monitor'], operation: ['create'] } },
				description: 'Screenshot Happy POSTs here when a change is detected (up to 3 delivery attempts: immediately, then +5s, then +30s)',
			},
			{
				displayName: 'Check Frequency (Minutes)',
				name: 'frecuenciaMinutos',
				type: 'number',
				typeOptions: { minValue: 15 },
				default: 60,
				displayOptions: { show: { resource: ['monitor'], operation: ['create'] } },
				description: '15 minutes is the hard minimum for every plan; your plan may set a higher floor',
			},
			{
				displayName: 'Change Threshold (%)',
				name: 'umbralDiferencia',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 100 },
				default: 5,
				displayOptions: { show: { resource: ['monitor'], operation: ['create'] } },
				description: 'Percentage of changed pixels that counts as a real change',
			},

			// ---------------------------------------------------------------
			// Monitor: Delete
			// ---------------------------------------------------------------
			{
				displayName: 'Monitor ID',
				name: 'monitorId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { resource: ['monitor'], operation: ['delete'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'screenshot') {
					const url = this.getNodeParameter('url', i) as string;
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

					const qs: Record<string, string | number | boolean> = { url };

					if (operation === 'generatePdf') {
						const pdfOptions = this.getNodeParameter('pdfOptions', i) as {
							full_page?: boolean;
							width?: number;
							height?: number;
						};
						qs.format = 'pdf';
						if (pdfOptions.full_page) qs.full_page = true;
						if (pdfOptions.width) qs.width = pdfOptions.width;
						if (pdfOptions.height) qs.height = pdfOptions.height;
					} else {
						const options = this.getNodeParameter('options', i) as {
							format?: string;
							quality?: number;
							width?: number;
							height?: number;
							selector?: string;
						};
						if (options.format) qs.format = options.format;
						if (options.format === 'jpeg' && options.quality) qs.quality = options.quality;
						if (options.width) qs.width = options.width;
						if (options.height) qs.height = options.height;
						if (options.selector) qs.selector = options.selector;
						if (operation === 'takeFullPageScreenshot') qs.full_page = true;
					}

					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'screenshotHappyApi',
						{
							method: 'GET',
							url: `${BASE_URL}/screenshot`,
							qs,
							encoding: 'arraybuffer',
							returnFullResponse: true,
						},
					);

					const contentType = (response.headers['content-type'] as string) || 'image/png';
					const binaryData = await this.helpers.prepareBinaryData(
						Buffer.from(response.body as ArrayBuffer),
						operation === 'generatePdf' ? 'screenshot.pdf' : `screenshot.${qs.format || 'png'}`,
						contentType,
					);

					returnData.push({
						json: { url, format: qs.format || 'png' },
						binary: { [binaryPropertyName]: binaryData },
						pairedItem: { item: i },
					});
				} else if (resource === 'monitor') {
					if (operation === 'create') {
						const body = {
							url: this.getNodeParameter('monitorUrl', i) as string,
							webhook_url: this.getNodeParameter('webhookUrl', i) as string,
							frecuencia_minutos: this.getNodeParameter('frecuenciaMinutos', i) as number,
							umbral_diferencia: this.getNodeParameter('umbralDiferencia', i) as number,
						};

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'screenshotHappyApi',
							{
								method: 'POST',
								url: `${BASE_URL}/monitors`,
								body,
								json: true,
							},
						);

						returnData.push({ json: response, pairedItem: { item: i } });
					} else if (operation === 'getAll') {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'screenshotHappyApi',
							{
								method: 'GET',
								url: `${BASE_URL}/monitors`,
								json: true,
							},
						);

						const monitors = Array.isArray(response) ? response : [response];
						for (const monitor of monitors) {
							returnData.push({ json: monitor, pairedItem: { item: i } });
						}
					} else if (operation === 'delete') {
						const monitorId = this.getNodeParameter('monitorId', i) as string;

						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'screenshotHappyApi',
							{
								method: 'DELETE',
								url: `${BASE_URL}/monitors/${monitorId}`,
								json: true,
							},
						);

						returnData.push({ json: { success: true, id: monitorId }, pairedItem: { item: i } });
					} else {
						throw new NodeOperationError(this.getNode(), `Unknown monitor operation: ${operation}`);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				if (error instanceof NodeOperationError) throw error;
				throw new NodeApiError(this.getNode(), error as any);
			}
		}

		return [returnData];
	}
}
