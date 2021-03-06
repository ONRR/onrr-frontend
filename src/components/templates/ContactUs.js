import React from 'react'

import { useQuery } from '@apollo/react-hooks'
import { gql } from '@apollo/client'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography
} from '@material-ui/core'

import { makeStyles, createStyles } from '@material-ui/core/styles'

import MailIcon from '@material-ui/icons/Mail'
import PhoneIcon from '@material-ui/icons/Phone'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Loading from '../Loading'

const useStyles = makeStyles(theme =>
  createStyles({
    contacts: {
      marginBottom: 50,
    },
    category: {
      background: theme.palette.grey[200],
      padding: theme.spacing(1)
    },
    primaryContact: {
      background: theme.palette.grey[600],
      padding: theme.spacing(2),
      color: theme.palette.common.white,
    },
    accordion: {
      '& .MuiAccordionDetails-root': {
        display: 'inherit'
      }
    }
  })
)

const CONTACTS_QUERY = gql`
  query {
    contacts {
      id
      primary_contact
      primary_email
      primary_phone
    }
  }
`

const ContactAccordion = ({ summary, details }) => {
  const classes = useStyles();

  return (
    <div className={classes.accordion}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{summary}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {details}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

const ContactUs = () => {
  const { loading, error, data } = useQuery(CONTACTS_QUERY)
  const classes = useStyles()

  if (loading) return <Loading />
  if (error) return `Error! ${ error.message }`

  let contacts

  if (data) {
    contacts = data.contacts
    console.log('contacts: ', contacts)
    return (
      <Container maxWidth="lg">
        <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card>
            <CardContent>
              <Typography variant="h4" style={{ fontSize: 18 }}>
                {`Contact Us`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          
          {contacts.map(contact => (
            <Grid container spacing={2} className={classes.contacts}>
              <Grid container xs={12} className={classes.category}>
                {`Category: Paying > Federal accounts receivable, billing, and finance > Company Contact ${ contact.company ? `> ${ contact.company }` : '' }`}
              </Grid>
              <Grid container className={classes.primaryContact}>
                <Grid container xs={4}>
                  {contact.primary_contact}
                </Grid>
                <Grid container xs={4}>
                  <MailIcon /> {contact.primary_email}
                </Grid>
                <Grid container xs={4}>
                  {contact.primary_phone && <PhoneIcon /> } {contact.primary_phone}
                </Grid>
              </Grid>
              {contact.backup_contact &&
                <Grid container xs={12}>
                  <Grid item xs={12}>
                    <ContactAccordion summary="Additional Contacts" 
                    details={
                      <>
                        <Box>{contact.backup_contact}</Box>
                        <Box>{contact.backup_email}</Box>
                        <Box>{contact.backup_phone}</Box>
                      </>
                    } />
                  </Grid>
                </Grid>
              }

              {contact.supervisor &&
                <Grid container xs={12}>
                  <Grid item xs={12}>
                    <ContactAccordion summary="Supervisor" 
                    details={
                      <>
                        <Box>{contact.supervisor}</Box>
                        <Box>{contact.supervisor_email}</Box>
                        <Box>{contact.supervisor_phone}</Box>
                      </>
                    } />
                  </Grid>
                </Grid>
              }
            </Grid>
          ))}
          
        </Grid>
      </Grid>
      </Container>
    )
  }
}

export default ContactUs
