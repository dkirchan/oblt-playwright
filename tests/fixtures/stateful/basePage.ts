import { test as base } from "@playwright/test";
import DashboardPage from "../../stateful/pom/pages/dashboard.page";
import DatasetsPage from "../../stateful/pom/pages/datasets.page";
import DatePicker from "../../stateful/pom/components/date_picker.component";
import DependenciesPage from "../../stateful/pom/pages/dependencies.page";
import DiscoverPage from "../../stateful/pom/pages/discover.page";
import HostsPage from "../../stateful/pom/pages/hosts.page";
import InventoryPage from "../../stateful/pom/pages/inventory.page";
import LandingPage from "../../stateful/pom/pages/landing.page";
import LogsExplorerPage from "../../stateful/pom/pages/logs_explorer.page";
import ObservabilityPage from "../../stateful/pom/pages/observability.page";
import ServicesPage from "../../stateful/pom/pages/services.page";
import TracesPage from "../../stateful/pom/pages/traces.page";
import { ContextHolder } from "../../../src/contextHolder";

export const test = base.extend<{
  dashboardPage: DashboardPage;
  datasetsPage: DatasetsPage;
  datePicker: DatePicker;
  dependenciesPage: DependenciesPage;
  discoverPage: DiscoverPage;
  hostsPage: HostsPage;
  inventoryPage: InventoryPage;
  landingPage: LandingPage;
  logsExplorerPage: LogsExplorerPage;
  observabilityPage: ObservabilityPage;
  servicesPage: ServicesPage;
  tracesPage: TracesPage;
}>({
  page: async ({ page }, use, testInfo) => {
    console.log("Getting the page fixture.");
    const session = await page.context().newCDPSession(page);
    await session.send("Performance.enable");
    const contextInstance = ContextHolder.Instance;
    const workerIndex = process.env.TEST_WORKER_INDEX;
    if (!workerIndex) {
      console.log("Worker index does not exist");
      process.exit(1);
    }
    contextInstance.addToContextMap(workerIndex, {
      name: testInfo.title,
      session: session,
    });
    await use(page);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  datasetsPage: async ({ page }, use, testInfo) => {
    await use(new DatasetsPage(page));
  },

  datePicker: async ({ page }, use, testInfo) => {
    await use(new DatePicker(page));
  },

  dependenciesPage: async ({ page }, use, testInfo) => {
    await use(new DependenciesPage(page));
  },

  discoverPage: async ({ page }, use, testInfo) => {
    await use(new DiscoverPage(page));
  },

  hostsPage: async ({ page }, use, testInfo) => {
    await use(new HostsPage(page));
  },

  inventoryPage: async ({ page }, use, testInfo) => {
    await use(new InventoryPage(page));
  },

  landingPage: async ({ page }, use, testInfo) => {
    await use(new LandingPage(page));
  },

  logsExplorerPage: async ({ page }, use) => {
    await use(new LogsExplorerPage(page));
  },

  observabilityPage: async ({ page }, use) => {
    await use(new ObservabilityPage(page));
  },

  servicesPage: async ({ page }, use) => {
    await use(new ServicesPage(page));
  },

  tracesPage: async ({ page }, use) => {
    await use(new TracesPage(page));
  },
});
