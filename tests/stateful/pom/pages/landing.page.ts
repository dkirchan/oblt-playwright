import { Page } from "@playwright/test";
import { addAspectToPointcut } from "../../../../src/aspect/addAspectToPointcut";
import { LogAspect } from "../../../../src/aspect";
import { Advice } from "../../../../src/aspect/advice.enum";

export default class LandingPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
        addAspectToPointcut(page, '.*', Advice.Around, new LogAspect());
    }

    public async goto() {
        await this.page.goto('/');
    }

    readonly spaceSelector = () => this.page.locator('xpath=//h1[contains(text(),"Select your space")]');
    private readonly toggleNavButton = () => this.page.getByTestId('toggleNavButton');
    private readonly homeLink = () => this.page.getByTestId('homeLink');
    private readonly discover = () => this.page.locator('xpath=//span[@title="Discover"]');
    private readonly dashboards = () => this.page.locator('xpath=//div[@class="euiFlyoutBody__overflowContent"]//*[contains(text(),"Dashboards")]');
    private readonly observability = () => this.page.locator('xpath=//span[contains(@class,"euiAccordion__buttonContent")]//a[contains(text(),"Observability")]');
    private readonly observabilitySolutionLink = () => this.page.locator('xpath=//div[@data-test-subj="homSolutionPanel homSolutionPanel_observability"]//a[contains(text(),"Observability")]');
    private readonly apm = () => this.page.getByRole('link', { name: 'APM' });
    private readonly alerts = () => this.page.getByTestId('observability-nav-observability-overview-alerts');
    private readonly infrastructure = () => this.page.getByRole('link', { name: 'Infrastructure' });
    private readonly stackManagement = () => this.page.locator('xpath=//span[@title="Stack Management"]');

    public async clicktoggleNavButton() {
        await this.toggleNavButton().click();
        }

    public async clickhomeLink() {
        await this.homeLink().click();
        }
        
    public async clickDiscover() {
        await this.discover().click();
        }

    public async clickDashboards() {
        await this.dashboards().click();
        }

    public async clickAlerts() {
        await this.alerts().click();
        }

    public async clickObservability() {
        await this.observability().click();
        }

    public async clickAPM() {
        await this.apm().click();
    }

    public async clickInfrastructure() {
        await this.infrastructure().click();
    }

    public async clickStackManagement() {
        await this.stackManagement().click();
    }

    public async clickObservabilitySolutionLink() {
        await this.observabilitySolutionLink().click();
        }
}