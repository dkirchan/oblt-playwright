import { Page } from "@playwright/test";
import { addAspectToPointcut } from "../../../../src/aspect/addAspectToPointcut";
import { LogAspect } from "../../../../src/aspect";
import { Advice } from "../../../../src/aspect/advice.enum";

export default class AbstractPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
        addAspectToPointcut(page, '.*', Advice.Around, new LogAspect());
    }
}