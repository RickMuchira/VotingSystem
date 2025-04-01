import AdminLayout from "./layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users, Vote, FileText } from "lucide-react"

export default function AdminDashboard() {
  // Mock statistics data that would come from your backend
  const stats = {
    totalElections: 12,
    totalPositions: 24,
    totalCandidates: 48,
    totalVoters: 2350,
  }

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your voting system.</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalElections}</div>
              <p className="text-xs text-muted-foreground">3 active, 9 completed</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPositions}</div>
              <p className="text-xs text-muted-foreground">Across all elections</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">Across all elections</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Voters</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVoters}</div>
              <p className="text-xs text-muted-foreground">+180 from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <Card className="w-full lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Elections</CardTitle>
              <CardDescription>Overview of your most recent elections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[300px] rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Election activity chart</p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Voter Turnout</CardTitle>
              <CardDescription>Voter participation across elections.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[300px] rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Voter turnout chart</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Active Elections</CardTitle>
              <CardDescription>Currently ongoing elections.</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Student Council Election 2025</p>
                    <p className="text-xs text-muted-foreground">Ends in 5 days</p>
                  </div>
                  <div className="text-sm font-medium ml-2">68% turnout</div>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Computer Science Department Election</p>
                    <p className="text-xs text-muted-foreground">Ends in 2 days</p>
                  </div>
                  <div className="text-sm font-medium ml-2">42% turnout</div>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Engineering Faculty Election</p>
                    <p className="text-xs text-muted-foreground">Ends in 10 days</p>
                  </div>
                  <div className="text-sm font-medium ml-2">35% turnout</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Upcoming Elections</CardTitle>
              <CardDescription>Elections scheduled to start soon.</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Business School Election</p>
                    <p className="text-xs text-muted-foreground">Starts in 2 days</p>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Arts Department Election</p>
                    <p className="text-xs text-muted-foreground">Starts in 5 days</p>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Student Union Election</p>
                    <p className="text-xs text-muted-foreground">Starts in 12 days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system.</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-3">
                <div className="flex items-start p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 mt-0.5 h-2 w-2 rounded-full bg-gray-500"></div>
                  <div>
                    <p className="text-sm font-medium">New candidate registered</p>
                    <p className="text-xs text-muted-foreground">Morgan Wilson for Secretary</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 mt-0.5 h-2 w-2 rounded-full bg-gray-500"></div>
                  <div>
                    <p className="text-sm font-medium">Election created</p>
                    <p className="text-xs text-muted-foreground">Student Union Election 2025</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start p-2 rounded-md hover:bg-muted/50">
                  <div className="mr-3 mt-0.5 h-2 w-2 rounded-full bg-gray-500"></div>
                  <div>
                    <p className="text-sm font-medium">Voter batch imported</p>
                    <p className="text-xs text-muted-foreground">150 new voters added</p>
                    <p className="text-xs text-muted-foreground">Yesterday at 4:30 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

