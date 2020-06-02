import { TestBed } from "@angular/core/testing";

import { MainService, GAME_SPEED } from "./main.service";
import { OptionsService } from "./options.service";
import { FormatPipe } from "./format.pipe";

describe("MainService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [OptionsService, FormatPipe] })
  );

  it("should be created", () => {
    const service: MainService = TestBed.inject(MainService);
    expect(service).toBeTruthy();
  });

  it("Game speed should be one", () => {
    expect(GAME_SPEED).toBe(1);
  });
});
