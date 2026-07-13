import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="text-muted-foreground mt-2">
          Information about this application and its technologies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span>Application</span>
            <span>A & T Ecommerce Solution</span>
          </div>

          <div className="flex justify-between">
            <span>Version</span>
            <Badge>v1.0.0</Badge>
          </div>

          <div className="flex justify-between">
            <span>Environment</span>
            <Badge variant="secondary">Production</Badge>
          </div>

          <div className="flex justify-between">
            <span>Build Date</span>
            <span>01 July 2026</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>Next.js</Badge>
            <Badge>React</Badge>
            <Badge>TypeScript</Badge>
            <Badge>Tailwind CSS</Badge>
            <Badge>shadcn/ui</Badge>
            <Badge>FastAPI</Badge>
            <Badge>PostgreSQL</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Secure authentication</li>
            <li>Role-based access control</li>
            <li>Dashboard analytics</li>
            <li>User management</li>
            <li>Reporting and PDF export</li>
            <li>Responsive design</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Email: amar.tauqeer@gmail.com</p>
          <p>Website: https://amartauqeer.github.io/portfolio-next-tailwind</p>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-center text-sm text-muted-foreground">
        © 2026 A & T Ecommerce Solution. All rights reserved.
      </p>
    </div>
  );
}