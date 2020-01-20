import { Control } from "src/app/form-generator/decorators/control.decorator";
import { Required } from "src/app/form-generator/decorators/required.decorator";

export class CompetitionSettingsDto {
    @Control()
    @Required()
    open: boolean;
}
