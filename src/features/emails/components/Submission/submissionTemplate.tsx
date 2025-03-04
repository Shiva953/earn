import React from 'react';

import { styles } from '../../utils';

interface SubmissionProps {
  name: string;
  bountyName: string;
  type: 'bounty' | 'project' | 'hackathon';
}

export const SubmissionTemplate = ({
  name,
  bountyName,
  type,
}: SubmissionProps) => {
  const isProject = type === 'project';
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      {isProject ? (
        <>
          <p style={styles.textWithMargin}>
            Nice work! Your application for <strong>{bountyName}</strong> has
            been received. Pour yourself a glass of something tasty —
            you&apos;ve earned it 🥳
          </p>
          <p style={styles.textWithMargin}>
            The sponsor will soon review all other applications. We’ll then send
            you an email when the winners (hopefully including you) are
            announced!
          </p>
        </>
      ) : (
        <>
          <p style={styles.textWithMargin}>
            Nice work! Your submission for <strong>{bountyName}</strong> has
            been received. Pour yourself a glass of something tasty &mdash;
            you&rsquo;ve earned it 🥳
          </p>
          <p style={styles.textWithMargin}>
            Once the deadline passes, you&rsquo;ll be able to see all the other
            submissions on the listing page. We&rsquo;ll then send you an email
            once the winners (hopefully including you) are announced!
          </p>
        </>
      )}
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <p style={styles.unsubscribe}>
        Click{' '}
        <a
          href="https://airtable.com/appqA0tn8zKv3WJg9/shrsil6vncuj35nHn"
          style={styles.unsubscribeLink}
        >
          here
        </a>{' '}
        to unsubscribe from all emails from Superteam Earn.
      </p>
    </div>
  );
};
