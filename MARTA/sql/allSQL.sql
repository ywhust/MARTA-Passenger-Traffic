--User Log in
SELECT * 
FROM User
WHERE Username = '?';

--User registration
--Check the User exists or not
SELECT COUNT(*)
FROM User 
WHERE Username = '?';
--if not exists;
INSERT INTO User(Username, Password, IsAdmin)
VALUES('?', '?', 0);

INSERT INTO Passenger(Username, Email)
VALUES('?', '?');

--check whether the breezecard exists or not
SELECT COUNT(*)
FROM Breezecard
WHERE BreezecardNum = '?';
--if not exist 
INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo)
VALUES('?', 0, '?');
--if exists but belongs to nobody
UPDATE Breezecard
SET BelongsTo = '?'
WHERE BreezecardNum = '?';
--if exists in the breezecard and already belongs to somebody 
INSERT INTO Conflict(Username, BreezecardNum)
VALUES('?', '?');

--insert a new breezecard into the Breezecard table.
INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo)
VALUES('?', 0, '?');

--get all the BreezecardNum to generate a new BreezecardNum
SELECT BreezecardNum
FROM Breezecard;
INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo)
VALUES('?', 0, '?');
----------------------------------------------------------------------------------------------
---------------------------------------Admin functionality------------------------------------
----------------------------------------------------------------------------------------------
--query stations table
SELECT *
FROM Station;

--view one station's detail
SELECT * 
FROM Station
WHERE StopID = '?';

--if the station is bus station, also display the intersection;
SELECT S.StopID, S.Name, S.EnterFare, S.ClosedStatus, I.Intersection
FROM Station AS S, BusStationIntersection AS I
WHERE S.StopID = '?' And S.StopID = I.StopID;

--create a station;
INSERT INTO Station(StopID, Name, EnterFare, ClosedStatus, IsTrain)
VALUES(?, ?, ?, ?, ?);

--if it's a bus station, optionally insert its intersection;
INSERT INTO BusStationIntersection(StopID, Intersection) 
VALUES('?', '?');

--Set Station EnterFare, Set CloseStatus;
UPDATE Station 
SET EnterFare = '?' 
WHERE StopID = '?';

UPDATE Station 
SET ClosedStatus = '?' 
WHERE StopID = '?';

--Suspend a breeze card;
--INSERT INTO Conflict(Username, BreezecardNum)
--VALUES('?', '?');

--Transfer a breezecard
DELETE FROM Conflict 
WHERE BreezecardNum = '?';

--if assigns to a new owner;
UPDATE Breezecard
SET BelongsTo = '?' 
WHERE BreezecardNum = '?';

--check whether previous owner has no card;
SELECT COUNT(*)
FROM Breezecard 
WHERE BelongsTo = '?';

--if the assignment of one card result in previous owner has no card;
INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo)
VALUES('?', '?', '?');

--add values to the breezecard;
UPDATE Breezecard
SET Value = '?'
WHERE BreezecardNum = '?';

--View all of the Breeze Cards in the database.
SELECT *
FROM Breezecard;
--View the filtered Breeze Cards;
SELECT * 
FROM Breezecard
WHERE BreezecardNum = '?' AND BelongsTo = '?' AND Value >= ? AND Value <= ?;

--check breezecard info if breezecard in the conflict then BelongsTo show suspended, add filter.
SELECT B.BreezecardNum, B.Value, IF(B.BreezecardNum NOT IN (SELECT BreezecardNum FROM Conflict), B.BelongsTo, 'Suspended') AS BelongsTo
FROM Breezecard AS B
WHERE B.BreezecardNum = '?' AND B.BelongsTo = '?' AND B.Value >= ? AND B.Value <= ?;

--View passenger flow report;
SELECT IFNULL(M.StartsAt, M.EndsAt) AS StartsAt, M.passengersIn, M.passengersOut, (M.passengersIn - M.passengersOut) AS Flow, M.Tripfare
FROM (
	SELECT X.StartsAt, X.EndsAt, IFNULL(X.passengersIn, 0) AS passengersIn, IFNULL(X.passengersOut, 0) AS passengersOut, IFNULL(X.Tripfare, 0) AS Tripfare
	FROM (SELECT* FROM (SELECT StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare FROM Trip WHERE StartTime >= '2017-10-31 09:30:00' AND StartTime <= '2017-11-05 04:21:49' GROUP BY StartsAt) AS S LEFT JOIN (SELECT EndsAt, count(*) AS passengersOut FROM Trip WHERE StartTime >= '2017-10-31 09:30:00' AND StartTime <= '2017-11-05 04:21:49' GROUP BY EndsAt) AS E ON S.StartsAt = E.EndsAt
UNION
SELECT * 
FROM (
	SELECT StartsAt, COUNT(*) AS passengersIn, SUM(Tripfare) AS Tripfare
	FROM Trip 
	WHERE StartTime >= '2017-10-31 09:30:00' AND StartTime <= '2017-11-05 04:21:49'
	GROUP BY StartsAt) AS S
RIGHT JOIN (
	SELECT EndsAt, count(*) AS passengersOut
	FROM Trip 
	WHERE StartTime >= '2017-10-31 09:30:00' AND StartTime <= '2017-11-05 04:21:49'
	GROUP BY EndsAt) AS E 
ON S.StartsAt = E.EndsAt) AS X
	WHERE X.StartsAt IS NOT NULL OR X.EndsAt IS NOT NULL) AS M;
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------
------------------------------------Passenger Functionality----------------------------------
---------------------------------------------------------------------------------------------
--show unlocked breezecard infomation for a specific user;
SELECT * 
FROM Breezecard AS B
WHERE B.BreezecardNum NOT IN (
	SELECT BreezecardNum 
	FROM Conflict) AND B.BelongsTo = '?';

--show balance of a particular card;
SELECT Value 
FROM Breezecard 
WHERE BreezecardNum = '?';

--if the user is in a trip,
--Select the user's breezecard which is still in trip;
SELECT M.Enterfare, T1.StartTime, T1.BreezecardNum, M.Name
FROM Trip AS T1, (SELECT * 
	FROM Station AS S 
	WHERE S.StopID IN (SELECT StartsAt FROM Trip AS T WHERE T.EndsAt is NULL)) AS M
WHERE T1.StartsAt = M.StopID AND T1.BreezecardNum IN (SELECT BreezecardNum FROM Breezecard WHERE BelongsTo = '?');

--if no breezecard is in the trip
--Start a trip;
--show the enterfare of one Station;
SELECT EnterFare
FROM Station
WHERE Name = '?';
--if the breezecard balance is greater than the enter fare of one station
--Update Breezecard value;
UPDATE Breezecard
SET Value = '?' 
WHERE BreezecardNum = '?';

--Add a Trip and Assign a start station;
INSERT INTO Trip(Tripfare, StartTime, BreezecardNum, StartsAt)
VALUES (?, '?', '?', (SELECT StopID FROM Station WHERE Name = '?'));

--if log back in one breeze card is still on the trip, then show the infomation
--find the start station's name and enterfare, trip's start time and breezecard number.
SELECT T1.Tripfare, T1.StartTime, T1.BreezecardNum, M.Name
FROM Trip AS T1, (
	SELECT * 
	FROM Station AS S 
	WHERE S.StopID IN (SELECT StartsAt FROM Trip AS T WHERE T.EndsAt is NULL)) AS M WHERE T1.StartsAt = M.StopID;

--To end one breezecard's trip;
--get a station whose type is same to the start station;
SELECT Name 
FROM Station AS S 
WHERE S.IsTrain = (
	SELECT IsTrain FROM Station AS C 
	WHERE C.Name = '?');

--End one breezecard's trip;
UPDATE Trip 
SET EndsAt = (SELECT StopID 
	FROM Station 
	WHERE Name = '?') 
WHERE BreezecardNum = '?' AND StartTime = '?';

--Manage Breeze Card
--show unlocked breezecard infomation for a specific user;
SELECT * 
FROM Breezecard AS B 
WHERE B.BreezecardNum NOT IN (SELECT BreezecardNum FROM Conflict) AND B.BelongsTo = '?';

--Add one card to a user
--check the breezecard exists or not
SELECT COUNT(*)
FROM Breezecard
WHERE BreezecardNum = '?';
--if not exist 
INSERT INTO Breezecard(BreezecardNum, Value, BelongsTo)
VALUES('?', 0, '?');
--if exists but belongs to nobody
UPDATE Breezecard
SET BelongsTo = '?' 
WHERE BreezecardNum = '?';
--if exists in the breezecard and already belongs to somebody 
INSERT INTO Conflict(Username, BreezecardNum)
VALUES('?', '?');

--Remove one breezecard from a user, which is not in the trip;
UPDATE Breezecard
SET BelongsTo = NULL
WHERE BreezecardNum = '?' AND (BreezecardNum NOT IN (SELECT BreezecardNum FROM Trip) OR (SELECT EndsAt FROM Trip WHERE BreezecardNum = '?') IS NOT NULL);

--add value to one breezecard
UPDATE Breezecard
SET Value = ?
WHERE BreezecardNum = '?';

--View Trip History;
SELECT I.StartTime, I.Name AS Source, S.Name AS Destination, I.Tripfare, I.BreezecardNum 
FROM (
    SELECT T.StartTime, S.Name, T.EndsAt, T.Tripfare, T.BreezecardNum 
    FROM (
        SELECT * FROM Trip 
        WHERE BreezecardNum NOT IN (
            SELECT BreezecardNum FROM Conflict
            ) AND BreezecardNum IN (
            SELECT BreezecardNum FROM Breezecard WHERE BelongsTo = '?'
            ) AND StartTime >= '?' AND StartTime <= '?'
        ) AS T, Station AS S 
    WHERE T.StartsAt = S.StopID
    ) AS I, Station AS S 
WHERE I.EndsAt = S.StopID;
--------------------------------------------------------------------------------------------

