import { AssetType } from "../enums/AssetType";
import { LicenseType } from "../enums/LicenseType";
import { ProjectType } from "../enums/ProjectType";
import { StatusType } from "../enums/StatusType";
import { Asset } from "./asset";
import { Rating } from "./rating";

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
         documentation: string,
         projectType: ProjectType,
         ratings:Rating[]=[],
         comments:Comment[]=[],
      public icon: string 
    ) {
      super(id, name,type,label, publisher, publisherMail, publishDate, license, status,image, description,documentation,projectType, ratings, comments);
    }
  }
  