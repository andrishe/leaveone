import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function LeaveRejectedEmail(props: {
  startDate: Date;
  endDate: Date;
  approverName: string;
  reason: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Votre demande de congé a été refusée</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Demande de congé refusée ❌
          </Text>
          <Text>
            Votre demande de congé a été refusée par {props.approverName}.
          </Text>
          <Section>
            <Text>📅 Du {props.startDate.toLocaleDateString('fr-FR')}</Text>
            <Text>📅 Au {props.endDate.toLocaleDateString('fr-FR')}</Text>
          </Section>
          <Section style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Raison du refus :</Text>
            <Text style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 4 }}>
              {props.reason}
            </Text>
          </Section>
          <Text style={{ color: '#6b7280', fontSize: 14, marginTop: 20 }}>
            Pour plus d'informations, veuillez contacter votre manager.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
