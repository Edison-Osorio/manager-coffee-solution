export class CreateHarvestedDto {
  readonly employeeId: number;
  readonly week: {
    start: Date;
    end: Date;
  };
  readonly days: Array<{
    day: string;
    date: Date;
    coffeeAmount: number;
  }>;
}
