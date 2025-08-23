1) Create the task management api project.

dotnet new webapi -n TaskManagementAPI
cd TaskManagementAPI
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Cors

2) run from vs code 
	a - In case you have http profile in launchsetting.json 
		dotnet watch -lp https
	b - Else delete the http profile and simply run 
		dotnet run


3) To view SQLite Database
	a) install extension "SQLite"
	b) Ctr + Shift + P to open preference and search sql lite
	c) You will see open database and select the sql lite db file
	b) You will see SQLLITE Explorer window and can query sql lite db
