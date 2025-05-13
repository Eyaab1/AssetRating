import { Asset } from "./asset";
import { AssetType } from "../enums/AssetType";
import { LicenseType } from "../enums/LicenseType";
import { ProjectType } from "../enums/ProjectType";
import { StatusType } from "../enums/StatusType";
import { Rating } from "./rating";
import { Tag } from "./tag";
import { Category } from "./category";
import { AssetRelease } from "./asset-release";

export class Sheet extends Asset {
  constructor(
    id: string,
    name: string,
    type: AssetType.Sheet,
    label: string,
    publisher: string,
    publisherMail: string,
    publishDate: Date,
    license: LicenseType,
    status: StatusType,
    image: string,
    description: string,
    downloadCount: number,
    documentation: string,
    projectType: ProjectType,
    tags: Tag[] = [],
    categories: Category[] = [],
    public icon: string,
    parentAsset: Asset | null = null,
    releases: AssetRelease[] = [],
    ratings: Rating[] = [],
    comments: Comment[] = [],
    averageRating?: number,
    reviewsCount?: number
  ) {
    super(
      id, name, type, label, publisher, publisherMail, publishDate, license, status,
      image, description,downloadCount, documentation, projectType, tags, categories, releases,
      parentAsset, ratings, comments, averageRating, reviewsCount
    );
  }
}
