import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi I will use this website to resolve the top75 questions for React</p>
        <p>
          (Here is the reference{' '}
          <a href="https://www.greatfrontend.com/interviews/gfe75">Greate Frontend 75</a>.)
        </p>
      </section>
    </Layout>
  );
}