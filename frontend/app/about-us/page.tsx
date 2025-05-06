import { Card, CardContent } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <Card className="max-w-3xl p-6 shadow-lg">
        <h1 className="text-4xl font-bold text-primary">About Our Project</h1>
        <CardContent>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered system is designed to assist in the early detection of Vascular Dementia.
            By analyzing MRI scans, we aim to provide a fast and efficient diagnosis tool for healthcare professionals.
          </p>

          <div className="mt-6 text-left">
            <h2 className="text-2xl font-semibold text-gray-800">Our Team:</h2>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>Udara Sampath - AI & ML Engineer</li>
              <li>Team Member 2 - Frontend Developer</li>
              <li>Team Member 3 - Backend Engineer</li>
            </ul>

            <h2 className="mt-6 text-2xl font-semibold text-gray-800">Our Goal:</h2>
            <p className="text-gray-700 mt-2">
              To leverage AI for improving early diagnosis of vascular dementia and enhance patient care.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
