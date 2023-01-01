/**
 * Bank Information Form
 */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, Input } from '../ui';
import { saveBankInfo, previousStep, nextStep } from '../../store/slices/profileSlice';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const IBANInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.info}10;
  border-left: 4px solid ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

// IBAN validation function
const validateIBAN = (iban) => {
  if (!iban) return true; // Optional field
  
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  
  // Check length
  if (cleaned.length < 15 || cleaned.length > 34) {
    return `IBAN must be 15-34 characters (current: ${cleaned.length})`;
  }
  
  // Check format: 2 letters (country) + 2 digits + alphanumeric
  if (cleaned.length >= 4) {
    const countryCode = cleaned.substring(0, 2);
    const checkDigits = cleaned.substring(2, 4);
    
    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return 'IBAN must start with 2-letter country code (e.g., AE, GB, US)';
    }
    
    if (!/^[0-9]{2}$/.test(checkDigits)) {
      return 'IBAN country code must be followed by 2 check digits';
    }
  }
  
  // Check only alphanumeric
  if (!/^[A-Z0-9]+$/.test(cleaned)) {
    return 'IBAN can only contain letters and numbers';
  }
  
  return true;
};

const BankInfoForm = () => {
  const dispatch = useDispatch();
  const profileState = useSelector(state => state.profile);
  const { bankInfo, loading } = profileState;
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const ibanValue = watch('iban');
  
  console.log('BankInfoForm - RENDER');
  console.log('BankInfoForm - profileState:', profileState);
  console.log('BankInfoForm - bankInfo:', bankInfo);

  useEffect(() => {
    console.log('BankInfoForm - useEffect - bankInfo:', bankInfo);
    if (bankInfo) {
      console.log('BankInfoForm - Setting form values from bankInfo');
      Object.keys(bankInfo).forEach(key => {
        if (bankInfo[key] && key !== 'id' && key !== 'user') {
          console.log(`BankInfoForm - Setting ${key}:`, bankInfo[key]);
          setValue(key, bankInfo[key]);
        }
      });
    } else {
      console.log('BankInfoForm - No bankInfo to load');
    }
  }, [bankInfo, setValue]);

  const onSubmit = async (data) => {
    console.log('BankInfoForm - onSubmit called with data:', data);
    console.log('BankInfoForm - Current bankInfo state:', bankInfo);
    console.log('BankInfoForm - Dispatching saveBankInfo with raw data');
    
    // Include the ID if we're updating
    const payload = bankInfo?.id ? { ...data, id: bankInfo.id } : data;
    console.log('BankInfoForm - Final payload:', payload);
    
    await dispatch(saveBankInfo(payload));
    // Navigate to next step after successful save
    setTimeout(() => {
      dispatch(nextStep());
    }, 500);
  };

  // Format IBAN with spaces for better readability
  const formatIBAN = (value) => {
    if (!value) return '';
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <Input
            label="Bank Name"
            {...register('bank_name', { required: 'Bank name is required' })}
            error={errors.bank_name?.message}
            placeholder="e.g., Emirates NBD"
          />
        </FormRow>

        <FormRow>
          <Input
            label="Account Holder Name"
            {...register('account_holder_name', { required: 'Account holder name is required' })}
            error={errors.account_holder_name?.message}
            placeholder="Full name as on bank account"
          />
        </FormRow>

        <div>
          <Input
            label="IBAN"
            {...register('iban', { 
              validate: validateIBAN,
              onChange: (e) => {
              // Auto-format IBAN
              const formatted = formatIBAN(e.target.value);
              setValue('iban', formatted, { shouldValidate: true });
            }})}
            error={errors.iban?.message}
            placeholder="AE07 0331 2345 6789 0123 456"
            maxLength={42} // 34 chars + spaces
          />
          <IBANInfo>
            <strong>IBAN Format:</strong> Must start with 2-letter country code + 2 check digits + account number<br />
            <strong>Examples:</strong><br />
            • UAE: AE07 0331 2345 6789 0123 456<br />
            • UK: GB29 NWBK 6016 1331 9268 19<br />
            • US: US64 SVBK 0000 0000 1234 5678<br />
            <em>(Spaces are optional and will be removed automatically)</em>
          </IBANInfo>
        </div>

        <NavigationButtons>
          <Button type="button" variant="outline" onClick={() => dispatch(previousStep())}>
            Previous
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </NavigationButtons>
      </form>
    </FormContainer>
  );
};

export default BankInfoForm;

