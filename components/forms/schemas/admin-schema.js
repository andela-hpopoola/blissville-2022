import {
  stringValidation,
  optionalValidation,
  required,
  requiredDate,
  arrayValidation,
  customSelectValidation,
  positiveNumberValidation,
} from './schema-helpers';

export const projectSchema = {
  name: stringValidation('Project Name'),
  type: stringValidation('Project Type'),
  image: stringValidation('Project Image'),
  description: stringValidation('Project Description'),
  street1: stringValidation('Street 1'),
  street2: optionalValidation(stringValidation('Street 2')),
  city: stringValidation('City'),
  state: stringValidation('State'),
  features: customSelectValidation('Shell Features'),
  standardFeatures: optionalValidation(arrayValidation('Standard Features')),
  supremeFeatures: optionalValidation(arrayValidation('Supreme Features')),
  paymentPlan: required('Payment Plan'),
  startDate: requiredDate('Start Date'),
  delivery: requiredDate('Delivery'),
};

export const propertySchema = {
  name: stringValidation('Project Name'),
  type: stringValidation('Project Type'),
  description: stringValidation('Project Description'),
  image: optionalValidation(stringValidation('Property Image')),
  size: positiveNumberValidation('Size'),
  totalUnits: positiveNumberValidation('Total Units'),
  availableUnits: positiveNumberValidation('Available Units'),
  baths: positiveNumberValidation('Baths'),
  beds: positiveNumberValidation('Beds'),
  toilets: positiveNumberValidation('Toilets'),
  floors: customSelectValidation('Floors'),
  parkingSpace: positiveNumberValidation('Parking Space'),
  price: positiveNumberValidation('Price'),
  standardPrice: optionalValidation(positiveNumberValidation('Standard Price')),
  supremePrice: optionalValidation(positiveNumberValidation('Supreme Price')),
};

export const filterSchema = {
  field: stringValidation('Field'),
  value: required('Value'),
};
