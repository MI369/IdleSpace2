import { TestBed } from "@angular/core/testing";
import { MainService, GAME_SPEED } from "./main.service";
import { OptionsService } from "./options.service";
import { FormatPipe } from "./format.pipe";
import { TimePipe } from "./time.pipe";
import { testImports } from "./app.component.spec";

describe("MainService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [OptionsService, FormatPipe, TimePipe],
      imports: [testImports]
    })
  );

  it("should be created", () => {
    const service: MainService = TestBed.inject(MainService);
    expect(service).toBeTruthy();
  });

  it("Game speed should be one", () => {
    // TODO: enable before release
    expect(GAME_SPEED).toBe(1);
  });
});
