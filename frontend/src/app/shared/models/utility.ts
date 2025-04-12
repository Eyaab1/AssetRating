import { Asset, ProjectType } from "./asset";
import { Rating } from "./rating";

export class Utility extends Asset {
  constructor(
    id: string,
    name: string,
    label: string,
    publisher: string,
    publisherMail: string,
    publishDate: Date,
    license: 'Free' | 'Paid',
    status: 'published' | 'unpublished'|'deleted',
    image: string,
    description: string,
    documentation: string,
    projectType:ProjectType,
    ratings:Rating[]=[],
    comments:Comment[]=[],
  ) {
    super(id, name,label, publisher, publisherMail, publishDate, license, status,image, description,documentation,'Utility',projectType, ratings, comments);
  }
  }
  