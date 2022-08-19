import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateActivityRouteDeleteTrigger1660915798964
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Modify trigger function
    // Drop the old one, create new one, then also drop and recreate the trigger
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS delete_difficulty_and_star_rating_votes ON activity_route;`,
    );

    await queryRunner.query(
      `DROP FUNCTION delete_difficulty_and_star_rating_votes();`,
    );

    await queryRunner.query(`
          -- if deleted was the only tick of a route then automatically delete users difficulty vote for this route
  
          CREATE OR REPLACE FUNCTION delete_difficulty_vote()
              RETURNS TRIGGER
              LANGUAGE plpgsql
              AS
          $$
          DECLARE
              numTicksLeft INTEGER;
          BEGIN            
              -- see if user has any ticks of this route left
              SELECT count(*) INTO numTicksLeft FROM activity_route
              WHERE "routeId" = OLD."routeId"
              AND "userId" = OLD."userId"
              AND "ascentType" IN ('redpoint', 'flash', 'onsight', 'repeat');
  
              -- if this was not the last tick, no need to do anything
              IF (numTicksLeft > 0) THEN
                  RETURN NULL;
              END IF;
  
              -- delete users difficulty vote for this route
              DELETE FROM difficulty_vote
              WHERE "userId" = OLD."userId"
              AND "routeId" = OLD."routeId";
  
              RETURN NULL;
          END
          $$;
      `);

    await queryRunner.query(`        
          DROP TRIGGER IF EXISTS delete_difficulty_vote ON activity_route;
          CREATE TRIGGER delete_difficulty_vote
              AFTER DELETE
              ON activity_route
              FOR EACH ROW
              EXECUTE PROCEDURE delete_difficulty_vote();
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Restore previous trigger function that also deleterd star rating vote
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS delete_difficulty_vote ON activity_route;`,
    );

    await queryRunner.query(`DROP FUNCTION delete_difficulty_vote();`);

    await queryRunner.query(`
          -- if deleted was the only tick of a route then automatically delete users difficulty vote for this route and users beauty (star rating) vote for this route
  
          CREATE OR REPLACE FUNCTION delete_difficulty_and_star_rating_votes()
              RETURNS TRIGGER
              LANGUAGE plpgsql
              AS
          $$
          DECLARE
              numTicksLeft INTEGER;
          BEGIN            
              -- see if user has any ticks of this route left
              SELECT count(*) INTO numTicksLeft FROM activity_route
              WHERE "routeId" = OLD."routeId"
              AND "userId" = OLD."userId"
              AND "ascentType" IN ('redpoint', 'flash', 'onsight', 'repeat');
  
              -- if this was not the last tick, no need to do anything
              IF (numTicksLeft > 0) THEN
                  RETURN NULL;
              END IF;
  
              -- delete users difficulty vote for this route
              DELETE FROM difficulty_vote
              WHERE "userId" = OLD."userId"
              AND "routeId" = OLD."routeId";
  
              -- delete users star rating (beauty) vote for this route
              DELETE FROM star_rating_vote
              WHERE "userId" = OLD."userId"
              AND "routeId" = OLD."routeId";
  
              RETURN NULL;
          END
          $$;
      `);

    await queryRunner.query(`        
          DROP TRIGGER IF EXISTS delete_difficulty_and_star_rating_votes ON activity_route;
          CREATE TRIGGER delete_difficulty_and_star_rating_votes
              AFTER DELETE
              ON activity_route
              FOR EACH ROW
              EXECUTE PROCEDURE delete_difficulty_and_star_rating_votes();
      `);
  }
}
