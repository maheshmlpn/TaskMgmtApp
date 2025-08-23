1) Create the task management api project.

dotnet new webapi -n TaskManagementAPI
cd TaskManagementAPI
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Cors

2	) run from vs code 
	a - In case you have http profile in launchsetting.json 
		dotnet watch -lp https
	b - Else delete the http profile and simply run 
		dotnet run
	