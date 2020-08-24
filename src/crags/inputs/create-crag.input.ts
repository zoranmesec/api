import { InputType, Field } from "@nestjs/graphql";
import { Country } from "src/countries/entities/country.entity";

@InputType()
export class CreateCragInput {
    @Field()
    name: string;
  
    @Field()
    slug: string;

    @Field()
    status: number;

    @Field()
    lat: number;

    @Field()
    lang: number;

    @Field()
    countryId: string;
}