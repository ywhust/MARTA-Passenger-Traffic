--User Log in
Select * from User where Username = '?';

--User registration
--check the User exists or not
Select count(*) from User where Username = '?';
--if not exists;
Insert into User(Username, Password, IsAdmin) Values('?', '?', 0);
Insert into Passenger(Username, Email) Values('?', '?');

--check the breezecard exists or not
Select count(*) from Breezecard where BreezecardNum = '?';
--if not exist 
Insert into Breezecard(BreezecardNum, Value, BelongsTo) values('?', 0, '?');
--if exists but belongs to nobody
Update Breezecard set BelongsTo = '?' where BreezecardNum = '?';
--if exists in the breezecard and already belongs to somebody 
Insert into Conflict(Username, BreezecardNum) Values('?', '?');
Insert into Breezecard(BreezecardNum, Value, BelongsTo) values('?', 0, '?');

----------------------------------------------------------------------------------------------
---------------------------------------Admin functionality------------------------------------
----------------------------------------------------------------------------------------------
--check out the stations
Select * from Station;

--view one station's detail
Select * from Station where StopID = '?';

--if the station is bus station, also display the intersection;
Select S.StopID, S.Name, S.EnterFare, S.ClosedStatus, I.Intersection from Station as S, BusStationIntersection AS I where S.StopID = '31955' And S.StopID = I.StopID;

--create a station;
Insert into Station(StopID, Name, EnterFare, ClosedStatus, IsTrain) Values(?, ?, ?, ?, ?);

--if it's a bus station, optionally insert its intersection;
Insert into BusStationIntersection(StopID, Intersection) values('?', '?');

--Set Station EnterFare, Set CloseStatus;
Update Station SET EnterFare = '?' where Name = '?' And IsTrain = '?';
Update Station SET ClosedStatus = '?' where Name = '?';

--Suspend a breeze card;
Insert into Conflict(Username, BreezecardNum) values('?', '?');

--Transfer a breezecard
Delete from Conflict where BreezecardNum = '?';

--if assigns to a new owner;
Update Breezecard set BelongsTo = '?' where BreezecardNum = '?';

--check whether previous owner has no card;
Select count(*) from Breezecard where BelongsTo = '?';

--if the assignment of one card result in previous owner has no card;
Insert into Breezecard(BreezecardNum, Value, BelongsTo) Values('?', '?', '?');

--add values to the breezecard;
Update Breezecard set Value = '?' where BreezecardNum = '?';

--View all of the Breeze Cards in the database.
Select * from Breezecard;
--View the filtered Breeze Cards;
Select * from Breezecard where BreezecardNum = '?' And BelongsTo = '?' And Value >= ? And Value <= ?;

--check breezecard info if breezecard in the conflict then BelongsTo show suspended, add filter.
Select B.BreezecardNum, B.Value, IF(B.BreezecardNum not in (select BreezecardNum from Conflict), B.BelongsTo, 'Suspended') AS BelongsTo from Breezecard AS B where B.BreezecardNum = '?' And B.BelongsTo = '?' And B.Value >= ? And B.Value <= ?;;

--View passenger flow report;
Select IFNULL(M.StartsAt, M.EndsAt) AS StartsAt, M.passengersIn, M.passengersOut, (M.passengersIn - M.passengersOut) AS Flow, M.Tripfare from (Select X.StartsAt, X.EndsAt, IFNULL(X.passengersIn, 0) AS passengersIn, IFNULL(X.passengersOut, 0) AS passengersOut, IFNULL(X.Tripfare, 0) AS Tripfare from (Select * from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by StartsAt) AS S Left JOIN (Select EndsAt, count(*) AS passengersOut from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by EndsAt) AS E on S.StartsAt = E.EndsAt
UNION
Select * from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by StartsAt) AS S RIGHT JOIN (Select EndsAt, count(*) AS passengersOut from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by EndsAt) AS E on S.StartsAt = E.EndsAt) AS X where X.StartsAt is not NULL or X.EndsAt is not Null) AS M;
---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------------
------------------------------------Passenger Functionality----------------------------------
---------------------------------------------------------------------------------------------
--show unlocked breezecard infomation for a specific user;
Select * from Breezecard AS B where B.BreezecardNum not in (select BreezecardNum from Conflict) And B.BelongsTo = '?';

--If no breezecard is in the trip
--show balance of a particular card;
Select Value from Breezecard where BreezecardNum = '?';

--if one breezecard is in the trip
--Select the user's breezecard which is still in trip;
Select M.Enterfare, T1.StartTime, T1.BreezecardNum, M.Name from Trip AS T1, (Select * from Station AS S where S.StopID IN (Select StartsAt from Trip AS T where T.EndsAt is NULL)) AS M where T1.StartsAt = M.StopID and T1.BreezecardNum IN (Select BreezecardNum from Breezecard where BelongsTo = '?');

--if no breezecard is in the trip
--Start a trip;
--show the enterfare of one Station;
Select EnterFare from Station where Name = '?';
--if the breezecard balance is greater than the enter fare of one station
--Update Breezecard value;
Update Breezecard SET Value = '?' where BreezecardNum = '?';

--Add a Trip and Assign a start station;
Insert into Trip(Tripfare, StartTime, BreezecardNum, StartsAt) VALUES (?, '?', '?', (Select StopID from Station where Name = '?'));

--if log back in one breeze card is still on the trip, then show the infomation
--find the start station's name and enterfare, trip's start time and breezecard number.
Select T1.Tripfare, T1.StartTime, T1.BreezecardNum, M.Name from Trip AS T1, (Select * from Station AS S where S.StopID IN (Select StartsAt from Trip AS T where T.EndsAt is NULL)) AS M where T1.StartsAt = M.StopID;

--To end one breezecard's trip;
--get a station whose type is same to the start station;
Select Name from Station AS S where S.IsTrain = (Select IsTrain FROM Station AS C where C.Name = '?');

--End one breezecard's trip;
Update Trip set EndsAt = (Select StopID from Station where Name = '?') where BreezecardNum = '?' And StartTime = '?';

--Manage Breeze Card
--show unlocked breezecard infomation for a specific user;
Select * from Breezecard AS B where B.BreezecardNum not in (select BreezecardNum from Conflict) And B.BelongsTo = '?';

--Add one card to a user
--check the breezecard exists or not
Select count(*) from Breezecard where BreezecardNum = '?';
--if not exist 
Insert into Breezecard(BreezecardNum, Value, BelongsTo) values('?', 0, '?');
--if exists but belongs to nobody
Update Breezecard set BelongsTo = '?' where BreezecardNum = '?';
--if exists in the breezecard and already belongs to somebody 
Insert into Conflict(Username, BreezecardNum) Values('?', '?');

--Remove one breezecard from a user, which is not in the trip;
Update Breezecard set BelongsTo = NULL WHERE BreezecardNum = '?' AND (BreezecardNum NOT IN (SELECT BreezecardNum FROM Trip) OR (SELECT EndsAt FROM Trip WHERE BreezecardNum = '?') IS NOT NULL);

--add value to one breezecard
Update Breezecard set Value = ? where BreezecardNum = '?';

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

