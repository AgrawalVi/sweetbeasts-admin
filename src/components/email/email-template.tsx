import React from 'react';
import { Body, Container, Head, Heading, Hr, Html, Img, Link, Section, Text } from '@react-email/components';

export function InviteUsersEmail() {
  return (
    <Html>
      <Head>
        <title>You're Invited!</title>
      </Head>
      <Body>
        <Container>
          <Section>
            <Img src="https://your-company-logo-url.com/logo.png" alt="Company Logo" width="200" />
            <Heading className="text-xl font-bold text-center mt-2">You're Invited!</Heading>
            <Text className="mt-4 text-base leading-normal text-gray-600">
              Hi there,
              <br />
              We're excited to invite you to join SweetBeasts.
            </Text>
            <Link href="https://your-invitation-link.com" className="inline-block bg-purple-500 text-white py-2 px-4 rounded mt-4 hover:bg-purple-600 text-center">
              Join Us Now
            </Link>
            <Hr className="my-4" />
            <Text className="text-sm text-gray-500">
              If you have any questions or need further information, feel free to contact our support team or visit our FAQ section.
            </Text>
            <Text className="text-xs text-gray-400 mt-4">
              © {new Date().getFullYear()} SweetBeasts. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
