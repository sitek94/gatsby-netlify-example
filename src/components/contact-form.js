import * as React from 'react'
import * as Yup from 'yup'
import styled from '@emotion/styled'
import theme from '../../config/theme'
import Message from './message'
import { MessageSentIllustration } from './illustrations'
import { css } from '@emotion/react'
import { Formik, Field, Form, ErrorMessage } from 'formik'

const ContactSchema = Yup.object().shape({
  email_address: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  first_name: Yup.string(),
})

function PostSubmissionMessage() {
  return (
    <div
      css={css`
        h2 {
          color: white !important;
        }
      `}
    >
      <Message
        illustration={MessageSentIllustration}
        title="Message sent"
        body={`Thanks for reaching out to me!
        I will get back to you as soon as possible.`}
      />
    </div>
  )
}

const ContactFormWrapper = styled.div({
  color: 'white',
  maxWidth: '350px',
  padding: '40px',
  background: theme.colors.purple_dark,
  backgroundImage:
    'linear-gradient(-213deg, #5e31dc 0%, #3155dc 100%), linear-gradient(32deg, rgba(255, 255, 255, 0.25) 33%, rgba(0, 0, 0, 0.25) 100%)',
  borderRadius: '5px',
})

const formCss = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  label {
    margin: 10px 0;
  }
  .field-error {
    display: block;
    color: rgba(255, 255, 255, 0.75);
    font-size: 80%;
  }
  input,
  label {
    width: 100%;
    font-size: 16px;
  }
  button {
    margin-top: 20px;
    font-size: 16px;
  }
`

const StyledFormikForm = styled(Form)`
  ${formCss};
`

// Fetch reducer
function fetchReducer(state, { type, response, error }) {
  switch (type) {
    case 'fetching': {
      return { error: null, response: null, pending: true }
    }
    case 'success': {
      return { error: null, response, pending: false }
    }
    case 'error': {
      return { error, response: null, pending: false }
    }
    default:
      throw new Error(`Unsupported type: ${type}`)
  }
}

function useFetch({ url, body }) {
  const [state, dispatch] = React.useReducer(fetchReducer, {
    error: null,
    response: null,
    pending: false,
  })
  const bodyString = JSON.stringify(body)

  React.useEffect(() => {
    if (url && bodyString) {
      dispatch({ type: 'fetching' })
      fetch(url, {
        method: 'post',
        body: bodyString,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(r => r.json())
        .then(
          response => dispatch({ type: 'success', response }),
          error => dispatch({ type: 'error', error })
        )
    }
  }, [url, bodyString])

  return state
}

// Contact Form
export default function ContactForm({ style, header = 'Send message' }) {
  const [values, setValues] = React.useState()
  const { pending, response, error } = useFetch({
    url: `http://localhost:9000/.netlify/functions/contact`,
    body: values,
  })

  const errorMessage = error ? 'Something went wrong!' : null
  const submitted = Boolean(response)

  const successful = response && response.success

  return (
    <ContactFormWrapper style={style}>
      {!successful && <h3>{header}</h3>}

      {!successful && (
        <Formik
          initialValues={{
            email_address: '',
            first_name: '',
          }}
          validationSchema={ContactSchema}
          onSubmit={setValues}
        >
          {() => (
            <StyledFormikForm>
              <label htmlFor="first_name">
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                  `}
                >
                  First name
                  <ErrorMessage
                    name="first_name"
                    component="span"
                    className="field-error"
                  />
                </div>
              </label>
              <Field
                id="first_name"
                aria-required="false"
                name="first_name"
                placeholder="Jane"
                type="text"
              />

              <label htmlFor="email">
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                  `}
                >
                  Email Address
                  <ErrorMessage
                    name="email_address"
                    component="span"
                    className="field-error"
                  />
                </div>
              </label>
              <Field
                id="email"
                aria-required="true"
                name="email_address"
                placeholder="Jane"
                type="email"
              />
              <button data-element="submit" type="submit">
                {!pending && 'Subscribe'}
                {pending && 'Submitting...'}
              </button>
            </StyledFormikForm>
          )}
        </Formik>
      )}
      {submitted && !pending && <PostSubmissionMessage response={response} />}
      {errorMessage && <div>{errorMessage}</div>}
    </ContactFormWrapper>
  )
}
