import { test } from '../fixtures/serverless/basePage';
import { expect } from "@playwright/test";
let apiKey = process.env.API_KEY;

test.beforeAll('Check node data', async ({request}) => {
  console.log(`... checking node data.`);
  const currentTime = Date.now();
  const rangeTime = currentTime - 1200000;

  let response = await request.post('api/metrics/snapshot', {
      headers: {
          "accept": "application/json",
          "Authorization": apiKey,
          "Content-Type": "application/json;charset=UTF-8",
          "kbn-xsrf": "true",          
          "x-elastic-internal-origin": "kibana"
      },
      data: {
          "filterQuery":"",
          "metrics":[{"type":"cpu"}],
          "nodeType":"host","sourceId":"default",
          "accountId":"",
          "region":"",
          "groupBy":[],
          "timerange":{"interval":"1m","to":currentTime,"from":rangeTime,"lookbackSize":5},
          "includeTimeseries":true,
          "dropPartialBuckets":true
      }
  })
  expect(response.status()).toBe(200);
  const jsonData = JSON.parse(await response.text());
  const nodesArr = jsonData.nodes;
  expect(nodesArr, 'The number of available nodes in the Inventory should not be less than 1.').not.toHaveLength(0);
  console.log(`✓ Node data is checked.`);
});

test.beforeEach(async ({ landingPage, page }) => {
  await landingPage.goto();
  if (await landingPage.spaceSelector().isVisible()) {
    await page.locator('xpath=//a[contains(text(),"Default")]').click();
    await expect(page.locator('xpath=//div[@data-test-subj="svlObservabilitySideNav"]')).toBeVisible();
  };
  await landingPage.clickInfrastructure();
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status == testInfo.expectedStatus) {
    console.log(`✓ [${testInfo.title}] completed in ${testInfo.duration} ms.\n`);
}});

test('Infrastructure - Cluster Overview dashboard', async ({ dashboardPage, datePicker, landingPage, page }, testInfo) => {
  const coresUsedVsTotal = "Cores used vs total cores";
  const topMemoryIntensivePods = "Top memory intensive pods";

  await test.step('step01', async () => {
    console.log(`\n[${testInfo.title}] Step 01 - Navigates to Dashboards, filters dashboards by Kubernetes tag.`);
    await landingPage.clickDashboards();
    await dashboardPage.assertVisibilityHeading();
    await dashboardPage.assertVisibilityTable();
    await dashboardPage.filterByKubernetesTag();
    await page.waitForLoadState('networkidle');
  });
 
  await test.step('step02', async () => {
    console.log(`\n[${testInfo.title}] Step 02 - Opens [Metrics Kubernetes] Cluster Overview dashboard.`);
    await page.getByRole('link', { name: "[Metrics Kubernetes] Cluster Overview" }).click();
    await page.waitForLoadState('networkidle');
  });

  await test.step('step03', async () => {
    console.log(`\n[${testInfo.title}] Step 03 - Filters data by selected time unit.`);
    await datePicker.clickDatePicker();
    await datePicker.fillTimeValue('1');
    await datePicker.selectTimeUnit('Hours');
    await datePicker.clickApplyButton();
  });
  
  await test.step('step04', async () => {
    console.log(`\n[${testInfo.title}] Step 04 - Logs Elasticsearch query - [Metrics Kubernetes] Cores used vs total cores.`);
    await dashboardPage.assertVisibilityVisualization(coresUsedVsTotal);
    await dashboardPage.kubernetesVisualizationOptions(coresUsedVsTotal);
    await dashboardPage.openRequestsView();
    await dashboardPage.queryToClipboard();
    await dashboardPage.logQuery(coresUsedVsTotal);
    await dashboardPage.closeFlyout();
  });
  
  await test.step('step05', async () => {
    console.log(`\n[${testInfo.title}] Step 05 - Logs Elasticsearch query - [Metrics Kubernetes] Top memory intensive pods.`);
    await dashboardPage.assertVisibilityVisualization(topMemoryIntensivePods);
    await dashboardPage.kubernetesVisualizationOptions(topMemoryIntensivePods);
    await dashboardPage.openRequestsView();
    await dashboardPage.queryToClipboard();
    await dashboardPage.logQuery(topMemoryIntensivePods);
    await dashboardPage.closeFlyout();
  });
});

test('Infrastructure - Inventory', async ({ datePicker, inventoryPage, landingPage, page }, testInfo) => {
  const cpuUsage = "infraAssetDetailsKPIcpuUsage";
  const memoryUsage = "infraAssetDetailsKPImemoryUsage";
  const podCpuUsage = "podCpuUsage";
  const podMemoryUsage = "podMemoryUsage";

  await test.step('step01', async () => {
    console.log(`\n[${testInfo.title}] Step 01 - Navigates to Observability > Infrastructure > Inventory.`);
    await landingPage.clickInventory();
  });

  await test.step('step02', async () => {
    console.log(`\n[${testInfo.title}] Step 02 - Clicks on any displayed host to open the detailed view.`);
    await inventoryPage.clickDismiss();
    await inventoryPage.sortByMetricValue();
    await inventoryPage.clickNodeWaffleContainer();
  });
  
  await test.step('step03', async () => {
    console.log(`\n[${testInfo.title}] Step 03 - Filters data by selected time unit. Asserts "Host CPU Usage" & "Host Memory Usage" visualizations visibility.`);
    await datePicker.clickDatePicker();
    if (await datePicker.assertSelectedDate()) {
      await datePicker.selectDate();
    } else {    
      await datePicker.fillTimeValue('30');
      await datePicker.selectTimeUnit('Days');
      await datePicker.clickApplyButton();
    }
    await page.waitForLoadState('networkidle');
    await inventoryPage.assertVisibilityVisualization(cpuUsage);
    await inventoryPage.assertVisibilityVisualization(memoryUsage);
  });

  await test.step('step04', async () => {
    console.log(`\n[${testInfo.title}] Step 04 - Returns back to Observability > Infrastructure > Inventory. Selects "Pods" as "Show" option.`);
    await inventoryPage.closeInfraAssetDetailsFlyout();
    await inventoryPage.switchInventoryToPodsView();
    await page.waitForLoadState('networkidle');
  });

  await test.step('step05', async () => {
    console.log(`\n[${testInfo.title}] Step 05 - Clicks on the tile of some pod, then clicks on the "Kubernetes Pod metrics" link.`);
    await inventoryPage.sortByMetricValue();
    await inventoryPage.switchToTableView();
    await page.waitForLoadState('networkidle');
    await inventoryPage.clickTableCell();
    await inventoryPage.clickPopoverK8sMetrics();
  });

  await test.step('step06', async () => {
    console.log(`\n[${testInfo.title}] Step 06 - Filters data by selected date picker option. Asserts "Pod CPU Usage" & "Pod Memory Usage" visualization visibility.`);
    await datePicker.assertVisibilityDatePicker();
    await datePicker.clickDatePicker();
    await datePicker.selectDate();
    await inventoryPage.assertVisibilityPodVisualization(podCpuUsage);
    await inventoryPage.assertVisibilityPodVisualization(podMemoryUsage);
  });
});