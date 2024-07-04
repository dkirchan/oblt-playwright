import { expect, Page } from "@playwright/test";
import AbstractPage from "./abstract.page";

export default class HostsPage extends AbstractPage {

    constructor(page: Page) {
        super(page);
    }

    private readonly hostsNumber = () => this.page.locator('xpath=//div[@data-test-subj="hostsViewKPI-hostsCount"]//p[@class="echMetricText__value"]');
    private readonly hostsTable = () => this.page.getByTestId('hostsView-table-loaded');
    private readonly hostsMetadataTab = () => this.page.getByTestId('infraAssetDetailsMetadataTab');
    private readonly hostsMetadataTable = () => this.page.locator('xpath=//div[@data-test-subj="infraAssetDetailsMetadataTable"]//tbody[@class="css-0"]');
    private readonly hostsMetricsTab = () => this.page.getByTestId('infraAssetDetailsMetricsTab');
    private readonly hostsProfilingTab = () => this.page.getByTestId('infraAssetDetailsProfilingTab');
    private readonly profilingTabFlamegraph = () => this.page.locator('xpath=//div[@data-test-subj="infraAssetDetailsProfilingTabContent"]//div[contains(@class, "echChartContent")]');
    private readonly profilingTabFlamegraphProgressBar = () => this.page.locator('xpath=//div[@aria-labelledby="flamegraph"]//span[@role="progressbar"]');
    private readonly hostsLimit500 = () => this.page.getByTestId('hostsViewLimitSelection500Button');
    private readonly hostsLogs = () => this.page.getByTestId('hostsView-tabs-logs');
    private readonly tableCellHosts = () => this.page.locator('xpath=//tbody//tr[1]//td//span[contains(@class, "euiTableCellContent__text")]');

    public async clickTableCellHosts() {
        await expect(this.hostsTable()).toBeVisible();
        await this.tableCellHosts().click();
        }
    
    public async setHostsLimit500() {
        await this.hostsLimit500().click();
        }

    public async openHostsMetadataTab() {
        await this.hostsMetadataTab().click();
        }

    public async openHostsMetricsTab() {
        await this.hostsMetricsTab().click();
        }

    public async openHostsProfilingTab() {
        await this.hostsProfilingTab().click();
        }

    public async openHostsLogs() {
        await this.hostsLogs().click();
        }

    public async assertHostsNumber() {
        const startTime = performance.now();
        await expect(this.hostsNumber(), 'Hosts number should not be 0').not.toHaveText('0');
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const result = {"Hosts Count": elapsedTime};
        return result;
        }

    public async assertVisibilityHostsTable() {
        const startTime = performance.now();
        await expect(this.hostsTable(), 'Hosts table should be visible').toBeVisible();
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const result = {"Host Names and Metrics": elapsedTime};
        return result;
        }

    public async assertVisibilityHostsMetadataTable() {
        const startTime = performance.now();
        await expect(this.hostsMetadataTable(), 'Metadata table should be visible').toBeVisible();
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const result = {"Metadata table": elapsedTime};
        return result;
        }

    public async assertVisibilityVisualization(title: string) {
        const startTime = performance.now();
        Promise.all([
            await expect(this.page.locator(`xpath=//div[@data-test-embeddable-id="${title}"]//div[contains(@class, "echChartContent")]`), `"${title}" visualization should be visible`).toBeVisible(),
            await expect(this.page.locator(`xpath=//div[@data-test-subj="${title}"]//div[contains(@class, "euiProgress")]`), 'Progress bar should not be visible').not.toBeVisible()
            ]);
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const result = {[title]: elapsedTime};
        return result;
        }

    public async assertVisibilityVisualizationMetricsTab(title: string) {
        const startTime = performance.now();
        Promise.all([
            await expect(this.page.locator(`xpath=//div[@data-test-subj="infraAssetDetailsMetricsTabContent"]//div[@data-test-embeddable-id="${title}"]//div[contains(@class, "echChartContent")]`), `"${title}" visualization should be visible`).toBeVisible(),
            await expect(this.page.locator(`xpath=//div[@data-test-subj="infraAssetDetailsMetricsTabContent"]//div[@data-test-embeddable-id="${title}"]//div[contains(@class, "euiProgress")]`), 'Progress bar should not be visible').not.toBeVisible()
            ]);
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const result = {[title]: elapsedTime};
        return result;
        }

    public async assertVisibilityProfilingFlamegraph() {
        const startTime = performance.now();
        Promise.all([
            await expect(this.profilingTabFlamegraph(), 'Flamegraph visualization should be visible').toBeVisible(),
            await expect(this.profilingTabFlamegraphProgressBar(), 'Progress bar should not be visible').not.toBeVisible()
            ]);
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        const result = {'Universal Profiling Flamegraph': elapsedTime};
        return result;
        }
}