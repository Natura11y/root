import React from 'react';

import RequiredIndicator from './RequiredIndicator';
import FormEntry from './FormEntry';

const Form = () => {
  return (

    <form >

        <RequiredIndicator />

        <FormEntry
          labelText='Full Name'
          helpText='Enter your first and last name'
          entryId='full-name'
          entryName='fullName'
        />

        <FormEntry />

        <FormEntry entryType='select' />

        <FormEntry entryType='groupRadio' />

        <FormEntry entryType='groupCheck' />

        <FormEntry entryType='fileUpload' />

        <button className="button theme-primary width-100 border-radius-pill">Send</button>

    </form>

  );
}

export default Form;