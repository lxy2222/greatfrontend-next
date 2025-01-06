

import { getJobsByPage } from '@/components/JobBoardData';
import JobBoard from '../components/ui/JobBoard';

export default function JobsPage() {
  return (
    <main>
      <JobBoard getJobAction={getJobsByPage} />
    </main>
  );
}
