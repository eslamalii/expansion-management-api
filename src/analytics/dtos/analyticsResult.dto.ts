import { TopVendorDto } from './topVendor.dto';

export class AnalyticsResultDto {
  country: string;
  researchDocumentsCount: number;
  topVendors: TopVendorDto[];
}
