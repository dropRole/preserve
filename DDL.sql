/*
Created: 15/12/2021
Modified: 13/02/2022
Project: pReserve
Model: Global
Author: dropRole
Version: 1.0
Database: PostgreSQL 10
*/


-- Create tables section -------------------------------------------------

-- Table accounts

CREATE TABLE "accounts"(
 "username" Character varying(20) NOT NULL,
 "password" Character varying(64) NOT NULL
)
WITH (
 autovacuum_enabled=true)
;

-- Add keys for table accounts

ALTER TABLE "accounts" ADD CONSTRAINT "PK_accounts" PRIMARY KEY ("username")
;

-- Table offerees

CREATE TABLE "offerees"(
 "id_offerees" UUID NOT NULL,
 "username" Character varying(20) NOT NULL,
 "email" Character varying(60) NOT NULL
)
WITH (
 autovacuum_enabled=true)
;

-- Create indexes for table offerees

CREATE INDEX "IX_accounts_offerees" ON "offerees" ("username")
;

-- Add keys for table offerees

ALTER TABLE "offerees" ADD CONSTRAINT "PK_offerees" PRIMARY KEY ("id_offerees")
;

-- Table offerors

CREATE TABLE "offerors"(
 "id_offerors" UUID NOT NULL,
 "name" Character varying(100) NOT NULL,
 "address" Character varying(80) NOT NULL,
 "email" Character varying(60) NOT NULL,
 "telephone" Character varying(13) NOT NULL,
 "business_hours" Text NOT NULL,
 "responsiveness" Smallint DEFAULT 5 NOT NULL
        CONSTRAINT "mark" CHECK (VALUE IN(5, 6, 7, 8, 9, 10)),
 "compliance" Smallint DEFAULT 5 NOT NULL
        CONSTRAINT "mark" CHECK (VALUE IN(5, 6, 7, 8, 9, 10)),
 "timeliness" Smallint DEFAULT 5 NOT NULL
        CONSTRAINT "mark" CHECK (VALUE IN(5, 6, 7, 8, 9, 10)),
 "username" Character varying(20) NOT NULL
)
WITH (
 autovacuum_enabled=true)
;
ALTER TABLE "offerors" ALTER COLUMN "responsiveness" SET STORAGE PLAIN
;
ALTER TABLE "offerors" ALTER COLUMN "compliance" SET STORAGE PLAIN
;
ALTER TABLE "offerors" ALTER COLUMN "timeliness" SET STORAGE PLAIN
;

-- Create indexes for table offerors

CREATE INDEX "IX_accounts_offerors" ON "offerors" ("username")
;

-- Add keys for table offerors

ALTER TABLE "offerors" ADD CONSTRAINT "PK_offerors" PRIMARY KEY ("id_offerors")
;

-- Table requests

CREATE TABLE "requests"(
 "id_requests" UUID NOT NULL,
 "id_offerors" UUID NOT NULL,
 "id_offerees" UUID NOT NULL,
 "requested_at" Timestamp NOT NULL,
 "requested_for" Timestamp NOT NULL,
 "seats" Smallint NOT NULL,
 "cause" Text NOT NULL,
 "note" Text
)
WITH (
 autovacuum_enabled=true)
;

-- Create indexes for table requests

CREATE INDEX "IX_offerors_requests" ON "requests" ("id_offerors")
;

CREATE INDEX "IX_offerees_requests" ON "requests" ("id_offerees")
;

-- Add keys for table requests

ALTER TABLE "requests" ADD CONSTRAINT "PK_requests" PRIMARY KEY ("id_requests")
;

-- Table reservations

CREATE TABLE "reservations"(
 "id_requests" UUID NOT NULL,
 "code" Character varying(8) NOT NULL,
 "confirmed_at" Timestamp NOT NULL
)
WITH (
 autovacuum_enabled=true)
;

-- Create indexes for table reservations

CREATE INDEX "IX_requests_reservations" ON "reservations" ("id_requests")
;

-- Add keys for table reservations

ALTER TABLE "reservations" ADD CONSTRAINT "PK_reservations" PRIMARY KEY ("id_requests")
;

-- Table complaints

CREATE TABLE "complaints"(
 "id_complaints" UUID NOT NULL,
 "id_requests" UUID NOT NULL,
 "username" Character varying(20) NOT NULL,
 "countered_to" UUID,
 "content" Text NOT NULL,
 "written" Timestamp NOT NULL
)
WITH (
 autovacuum_enabled=true)
;

-- Create indexes for table complaints

CREATE INDEX "IX_complaints_complaints" ON "complaints" ("countered_to")
;

CREATE INDEX "IX_reservations_complaints" ON "complaints" ("id_requests")
;

CREATE INDEX "IX_users_complaints" ON "complaints" ("username")
;

-- Add keys for table complaints

ALTER TABLE "complaints" ADD CONSTRAINT "PK_complaints" PRIMARY KEY ("id_complaints")
;

-- Table prohibitions

CREATE TABLE "prohibitions"(
 "id_prohibitions" UUID NOT NULL,
 "id_offerors" UUID NOT NULL,
 "id_offerees" UUID NOT NULL,
 "beginning" Timestamp NOT NULL,
 "conclusion" Timestamp NOT NULL,
 "cause" Text NOT NULL
)
WITH (
 autovacuum_enabled=true)
;

-- Create indexes for table prohibitions

CREATE INDEX "IX_offerors_prohibitions" ON "prohibitions" ("id_offerors")
;

CREATE INDEX "IX_offerees_prohibitions" ON "prohibitions" ("id_offerees")
;

-- Add keys for table prohibitions

ALTER TABLE "prohibitions" ADD CONSTRAINT "PK_prohibitions" PRIMARY KEY ("id_prohibitions")
;
-- Create foreign keys (relationships) section ------------------------------------------------- 

ALTER TABLE "reservations" ADD CONSTRAINT "requests_reservations" FOREIGN KEY ("id_requests") REFERENCES "requests" ("id_requests") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "complaints" ADD CONSTRAINT "complaints_complaints" FOREIGN KEY ("countered_to") REFERENCES "complaints" ("id_complaints") ON DELETE RESTRICT ON UPDATE CASCADE
;

ALTER TABLE "requests" ADD CONSTRAINT "offerors_requests" FOREIGN KEY ("id_offerors") REFERENCES "offerors" ("id_offerors") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "complaints" ADD CONSTRAINT "reservations_complaints" FOREIGN KEY ("id_requests") REFERENCES "reservations" ("id_requests") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "complaints" ADD CONSTRAINT "accounts_complaints" FOREIGN KEY ("username") REFERENCES "accounts" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "offerees" ADD CONSTRAINT "users_offerees" FOREIGN KEY ("username") REFERENCES "accounts" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "offerors" ADD CONSTRAINT "accounts_offerors" FOREIGN KEY ("username") REFERENCES "accounts" ("username") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "requests" ADD CONSTRAINT "offerees_requests" FOREIGN KEY ("id_offerees") REFERENCES "offerees" ("id_offerees") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "prohibitions" ADD CONSTRAINT "offerors_prohibitions" FOREIGN KEY ("id_offerors") REFERENCES "offerors" ("id_offerors") ON DELETE NO ACTION ON UPDATE NO ACTION
;

ALTER TABLE "prohibitions" ADD CONSTRAINT "offerees_prohibitions" FOREIGN KEY ("id_offerees") REFERENCES "offerees" ("id_offerees") ON DELETE NO ACTION ON UPDATE NO ACTION
;




