import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function LeaveApprovedEmail(props: {
  startDate: Date;
  endDate: Date;
  approverName: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Vos congés ont été approuvés ✅</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Congés approuvés ✅
          </Text>
          <Text>
            Bonne nouvelle ! Votre demande de congé a été approuvée par{' '}
            {props.approverName}.
          </Text>
          <Section>
            <Text>📅 Du {props.startDate.toLocaleDateString('fr-FR')}</Text>
            <Text>📅 Au {props.endDate.toLocaleDateString('fr-FR')}</Text>
          </Section>
          <Text style={{ color: '#6b7280', fontSize: 14 }}>
            Profitez bien de vos congés !
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
