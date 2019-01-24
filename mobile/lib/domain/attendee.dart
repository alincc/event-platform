enum Degree { Cegep, Bachelor, Master, PhD }

enum Gender { Male, Female, Other, NoAnswer }

enum ShirtSize { Small, Medium, Large, XLarge, XXLarge, Invalid }

class Attendee {
  static final Map<String, Degree> _degrees = {
    'cegep': Degree.Cegep,
    'bachelor': Degree.Bachelor,
    'master': Degree.Master,
    'phd': Degree.PhD,
  };

  static final Map<String, Gender> _genders = {
    'male': Gender.Male,
    'female': Gender.Female,
    'other': Gender.Other,
    'no_answer': Gender.NoAnswer,
  };


  static final Map<String, ShirtSize> _shirtSizes = {
    'small': ShirtSize.Small,
    'medium': ShirtSize.Medium,
    'large': ShirtSize.Large,
    'x-large': ShirtSize.XLarge,
    '2x-large': ShirtSize.XXLarge,
  };

  String id;
  String userId;
  String github;
  String linkedIn;
  String cv;
  String website;
  Degree degree;
  Gender gender;
  ShirtSize shirtSize;
  String phoneNumber;
  bool acceptSmsNotification;
  bool hasDietaryRestrictions;
  String dietaryRestrictions;
  String schoolId;
  String publicId;

  Attendee({
    this.id,
    this.userId,
    this.github,
    this.linkedIn,
    this.cv,
    this.website,
    this.degree,
    this.gender,
    this.shirtSize,
    this.phoneNumber,
    this.acceptSmsNotification,
    this.hasDietaryRestrictions,
    this.dietaryRestrictions,
    this.schoolId,
    this.publicId
  });

  Attendee.fromMap(Map<String, dynamic> map) {
    id = map["_id"];
    userId = map['userId'];
    github = map['github'];
    linkedIn = map['linkedIn'];
    cv = map['cv'];
    website = map['website'];
    degree = _degrees[map['degree']];
    gender = _genders[map['gender']];
    shirtSize = _shirtSizes[map['tshirt']];
    phoneNumber = map['phoneNumber'];
    acceptSmsNotification = map['acceptSMSNotification'];
    hasDietaryRestrictions = map['hasDietaryRestrictions'];
    dietaryRestrictions = map['dietaryRestrictions'];
    schoolId = map['school'];
    publicId = map['publicId'];
  }

  Attendee.fromInfoMap(Map<String, dynamic> map) {
        id = map["_id"];
        userId = map['userId'];
        github = map['github'];
        linkedIn = map['linkedIn'];
        website = map['website'];
        degree = _degrees[map['degree']];
        gender = _genders[map['gender']];
        shirtSize = _shirtSizes[map['tshirt']];
        phoneNumber = map['phoneNumber'];
        acceptSmsNotification = map['acceptSMSNotification'];
        hasDietaryRestrictions = map['hasDietaryRestrictions'];
        dietaryRestrictions = map['dietaryRestrictions'];
        schoolId = map['school']['_id'];
        publicId = map['publicId'];
    }
}

