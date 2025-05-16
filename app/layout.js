
import './globals.css';
import Layout from './components/Layout';

export const metadata = {
  title: 'Bugema University Timetabling System',
  description: 'Automated class timetabling application for Bugema University',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}