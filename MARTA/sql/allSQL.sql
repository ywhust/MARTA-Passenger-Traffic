Select I.StartTime, I.Name, S.Name, I.Tripfare, I.BreezecardNum from (Select T.StartTime, S.Name, T.EndsAt, T.Tripfare, T.BreezecardNum from (Select * from Trip where BreezecardNum = ? And startTime >= ? And startTime <= ? ) As T, Station As S where T.StartsAt = S.StopID) As I, Station AS S where I.EndsAt = S.StopID; 		//check the trip history;


