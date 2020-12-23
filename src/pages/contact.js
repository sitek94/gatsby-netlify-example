import * as React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'
import ContactForm from '../components/contact-form'

const IndexPage = () => (
  <Layout>
    <SEO title="Contact" />
    <h1>Contact Form</h1>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <div>
      <ContactForm />
    </div>
    <Link to="/">Home</Link> <br />
  </Layout>
)

export default IndexPage
