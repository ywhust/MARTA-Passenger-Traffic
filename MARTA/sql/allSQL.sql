Select I.StartTime, I.Name, S.Name, I.Tripfare, I.BreezecardNum from (Select T.StartTime, S.Name, T.EndsAt, T.Tripfare, T.BreezecardNum from (Select * from Trip where BreezecardNum = ? And startTime >= ? And startTime <= ? ) As T, Station As S where T.StartsAt = S.StopID) As I, Station AS S where I.EndsAt = S.StopID; 		
--check the trip history;

Select count(*) from Breezecard where BreezecardNum = 0123456780987654 and BelongsTo is NULL;
-- used to judge one Breezecard is in use or not;

Select count(*) from Breezecard where BreezecardNum = ?;
-- used to judge one Breezecard exist or not;

Insert into Breezecard(BreezecardNum, Value, BelongsTo) Values(?, 0.00, ?);
-- used to insert a Breezecard and assigned to a passenger;

Update Breezecard set Value = ? where BreezecardNum = ?;
--add values to the breezecard;

Update Breezecard set BelongsTo = NULL where BreezecardNum = ?;
-- remove breezecards association to one passenger;

Insert into Conflict(Username, BreezecardNum, DateTime) Values((Select BelongsTo from Breezecard where BreezecardNum = '?'), '?', NOW( ));
--suspend a card;

Delete from Conflict where BreezecardNum = ? And Username = ?;
Update Breezecard set BelongsTo = NULL where BreezecardNum = ?;
Update Breezecard set BelongsTo = ? where BreezecardNum = ?;
--resolve conflicts;


Select * from Breezecard AS B where B.BreezecardNum not in (select BreezecardNum from Conflict);
--show unlocked breezecard infomation;

Select Value from Breezecard where BreezecardNum = '?';
--show balance of a particular card;

Select * from Station where	Name = '?';
--start a trip and end a trip;


Select Sum(Tripfare) from Trip where StartsAt = '?' And StartsAt >= '?' And StartsAt <= '?';
--show the revenue;

Select count(*) from Trip where StartsAt = '?' And StartsAt >= '?' And StartsAt <= '?'
Select count(*) from Trip where EndsAt = '?' And StartsAt >= '?' And StartsAt <= '?'
--show the number of people entering the station or exiting the station;
--show the flow of passengers;

Select StartsAt, count(*) from Trip where StartsAt >= '?' And StartsAt <= '?' Group by StartsAt; 
Select EndsAt, count(*) from Trip where StartsAt >= '?' And StartsAt <= '?' Group by EndsAt;
Select StartsAt, Sum(Tripfare) from Trip where StartsAt >= '?' And StartsAt <= '?' Group by StartsAt;

Update Station(EnterFare, ClosedStatus) Values(?, ?) where StopID = '?'

Select StartsAt, count(*) from Trip Group by StartsAt; 
Select EndsAt, count(*) from Trip Group by EndsAt;

Select StartsAt, Sum(Tripfare) from Trip Group by StartsAt;

Select * from ((Select S.StartsAt, E.EndsAt, S.passengersIn, E.passengersOut, (S.passengersIn - E.passengersOut) AS flow from (Select StartsAt, count(*), SUM(Tripfare) AS passengersIn from Trip Group by StartsAt) AS S LEFT JOIN (Select EndsAt, count(*), SUM(Tripfare) AS passengersOut from Trip Group by EndsAt) AS E on S.StartsAt = E.EndsAt) 
UNION 
(Select S.StartsAt, E.EndsAt, S.passengersIn, E.passengersOut, (S.passengersIn - E.passengersOut), E.Tripfare,  AS flow from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip Group by StartsAt) AS S RIGHT JOIN (Select EndsAt, count(*) AS passengersOut, SUM(Tripfare) AS Tripfare from Trip Group by EndsAt) AS E on S.StartsAt = E.EndsAt)) AS X where X.StartsAt is not NULL or X.EndsAt is not Null;
--AS X where X.StartsAt is not NULL And X.EndsAt is not Null;
--problem needs to be solved



Select IFNULL(M.StartsAt, M.EndsAt) AS StartsAt, M.passengersIn, M.passengersOut, (M.passengersIn - M.passengersOut) AS Flow, M.Tripfare from (Select X.StartsAt, X.EndsAt, IFNULL(X.passengersIn, 0) AS passengersIn, IFNULL(X.passengersOut, 0) AS passengersOut, IFNULL(X.Tripfare, 0) AS Tripfare from (Select * from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by StartsAt) AS S Left JOIN (Select EndsAt, count(*) AS passengersOut from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by EndsAt) AS E on S.StartsAt = E.EndsAt
UNION
Select * from (Select StartsAt, count(*) AS passengersIn, SUM(Tripfare) AS Tripfare from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by StartsAt) AS S RIGHT JOIN (Select EndsAt, count(*) AS passengersOut from Trip where StartTime >= '2017-10-31 09:30:00' And StartTime <= '2017-11-05 04:21:49' Group by EndsAt) AS E on S.StartsAt = E.EndsAt) AS X where X.StartsAt is not NULL or X.EndsAt is not Null) AS M;









