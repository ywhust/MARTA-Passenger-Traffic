Select I.StartTime, I.Name, S.Name, I.Tripfare, I.BreezecardNum from (Select T.StartTime, S.Name, T.EndsAt, T.Tripfare, T.BreezecardNum from (Select * from Trip where BreezecardNum = ? And startTime >= ? And startTime <= ? ) As T, Station As S where T.StartsAt = S.StopID) As I, Station AS S where I.EndsAt = S.StopID; 		
--check the trip history;

Select count(*) from Breezecard where BreezecardNum = 0123456780987654 and BelongsTo is NULL;
-- used to judge one Breezecard is in use or not;

Select count(*) from Breezecard where BreezecardNum = ?;
-- used to judge one Breezecard exist or not;

Insert into Breezecard(BreezecardNum, Value, BelongsTo) values(?, 0.00, ?);
-- used to insert a Breezecard and assigned to a passenger;

Update Breezecard set Value = ? where BreezecardNum = ?;
--add values to the breezecard;

Update Breezecard set BelongsTo = NULL where BreezecardNum = ?;
-- remove breezecards association to one passenger;

Insert into Conflict(Username, BreezecardNum, DateTime) values((Select BelongsTo from Breezecard where BreezecardNum = '?'), '?', NOW( ));
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

Select StartsAt, count(*) from Trip Group by StartsAt; 











