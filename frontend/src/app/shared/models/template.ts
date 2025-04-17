import { AssetType } from "../enums/AssetType";
import { LicenseType } from "../enums/LicenseType";
import { ProjectType } from "../enums/ProjectType";
import { StatusType } from "../enums/StatusType";
import { Asset } from "./asset";
import { Rating } from "./rating";
import { Framework } from "../enums/framework";
export class Template extends Asset {
  constructor(
    id: string,
    name: string,
    type: AssetType.Template,
    label: string,
    publisher: string,
    publisherMail: string,
    publishDate: Date,
    license: LicenseType,
    status: StatusType,
    image: string,
    description: string,
    documentation: string,
    projectType: ProjectType,
    public framework: Framework,
    ratings: Rating[] = [],
    comments: Comment[] = [],
  ) {
    super(id, name, type, label, publisher, publisherMail, publishDate, license, status, image, description, documentation, projectType, ratings, comments);
  }
}
