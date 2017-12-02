Delete from Conflict where BreezecardNum = ? And Username = ?;
Update Breezecard set BelongsTo = NULL where BreezecardNum = ?;
Update Breezecard set BelongsTo = ? where BreezecardNum = ?;
--resolve conflicts;

Select * from Breezecard AS B where B.BreezecardNum not in (select BreezecardNum from Conflict);
--show unlocked breezecard infomation;

Select Value from Breezecard where BreezecardNum = '?';
--show balance of a particular card;

Update Station(EnterFare, ClosedStatus) Values(?, ?) where StopID = '?';

Select StartsAt, count(*) from Trip Group by StartsAt; 
Select EndsAt, count(*) from Trip Group by EndsAt;

Select StartsAt, Sum(Tripfare) from Trip Group by StartsAt;

Select IFNULL(M.StartsAt, M.EndsAt) AS StartsAt, M.passengersIn, M.passengersOut, (M.passengersIn - M.passengersOut) AS Flow, M.Tripfare from (Select X.StartsAt, X.EndsAt, IFNULL(X.passengersIn, 0) AS passengersIn, IFNULL(X.passengersOut, 0) AS passengersOut, IFNULL(X.Tripfare, 0) AS Tripfare from (Select * from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by StartsAt) AS S Left JOIN (Select EndsAt, count(*) AS passengersOut from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by EndsAt) AS E on S.StartsAt = E.EndsAt
UNION
Select * from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by StartsAt) AS S RIGHT JOIN (Select EndsAt, count(*) AS passengersOut from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by EndsAt) AS E on S.StartsAt = E.EndsAt) AS X where X.StartsAt is not NULL or X.EndsAt is not Null) AS M;
--for the station flow;

SELECT I.StartTime, I.Name AS Source, S.Name AS Destination, I.Tripfare, I.BreezecardNum 
FROM (
    SELECT T.StartTime, S.Name, T.EndsAt, T.Tripfare, T.BreezecardNum 
    FROM (
        SELECT * FROM Trip 
        WHERE BreezecardNum NOT IN (
            SELECT BreezecardNum FROM Conflict
            ) AND BreezecardNum IN (
            SELECT BreezecardNum FROM Breezecard WHERE BelongsTo = 'busrider73'
            ) AND StartTime >= ? AND StartTime <= ?
        ) AS T, Station AS S 
    WHERE T.StartsAt = S.StopID
    ) AS I, Station AS S 
WHERE I.EndsAt = S.StopID;
--check the trip history;





-------------------------------------------------------------------------------------------
--use to add a new card; check first, if not exist then assign the breezecard to the passenger

Select count(*) from Breezecard where BreezecardNum = 0123456780987654 and BelongsTo is NULL;
-- used to judge one Breezecard is in use or not;

Select count(*) from Breezecard where BreezecardNum = 0123456780987654;
--used to judge whether insert a new Breezecard;

Insert into Breezecard(BreezecardNum, Value, BelongsTo) Values(?, 0.00, ?);
-- used to insert a Breezecard and assigned to a passenger; For new card;

Update Breezecard set BelongsTo = ? where BreezecardNum = ?;
-- assign to a new passenger;

--If exist and belongs to somebody then supspend the card;
Insert into Conflict(Username, BreezecardNum, DateTime) Values((Select BelongsTo from Breezecard where BreezecardNum = '?'), '?', NOW( ));
--suspend a card;
--------------------------------------------------------------------------------------------


Update Breezecard set Value = ? where BreezecardNum = ?;
--add values to the breezecard;

Update Breezecard set BelongsTo = NULL where BreezecardNum = ?;
-- remove breezecards association to one passenger;

--------------------------------------------------------------------------------------------
--Start a trip;
Select Value from Breezecard where BreezecardNum = '?';
--show balance of a particular card;

Select EnterFare from Station where Name = '?';









--Add a Trip and Assign a start station;
INSERT INTO Trip(Tripfare, StartTime, BreezecardNum, StartsAt) VALUES (2.00, '2017-12-1 18:13:3', '0524807425551662', (Select StopID from Station where Name = 'Old Milton Pkwy - North Point Pkwy'));

Update Trip SET EndsAt =  (Select StopID from Station where Name = 'FP') where BreezecardNum = '1325138309325420' And StartTime = '2017-10-31 21:30:00';

Update Trip SET EndsAt =  NULL where BreezecardNum = '1325138309325420' And StartTime = '2017-10-31 21:30:00';





Update Trip SET StartTime =  '2017-10-31 21:30:00' where BreezecardNum = '1325138309325420';








