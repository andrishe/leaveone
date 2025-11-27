import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export default function LeaveRequestEmail(props: {
  employeeName: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  approvalUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Nouvelle demande de congé de {props.employeeName}</Preview>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Nouvelle demande de congé
          </Text>
          <Text>
            {props.employeeName} demande {props.totalDays} jour(s) de congé :
          </Text>
          <Section>
            <Text>📅 Du {props.startDate.toLocaleDateString('fr-FR')}</Text>
            <Text>📅 Au {props.endDate.toLocaleDateString('fr-FR')}</Text>
          </Section>
          <Button
            href={props.approvalUrl}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
            }}
          >
            Valider la demande
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
