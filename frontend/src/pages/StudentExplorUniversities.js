import React, { useState, useMemo } from 'react';
import { Search, Globe, Calendar, FileText, MapPin, ExternalLink } from 'lucide-react';

const StudentExploreUniversities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDeadline, setSelectedDeadline] = useState('all');

  const universities = [
    {
      id: 1,
      name: "Harvard University",
      country: "United States",
      location: "Cambridge, Massachusetts",
      website: "https://www.harvard.edu",
      deadline: "January 1, 2026",
      deadlineType: "Regular Decision",
      requirements: [
        "Common Application or Coalition Application",
        "SAT/ACT scores (optional for 2025-26)",
        "High school transcript",
        "Two teacher recommendations",
        "School report and counselor recommendation",
        "Application fee ($85) or fee waiver"
      ],
      allowedCountries: "All countries",
      description: "Ivy League institution offering world-class education across liberal arts and sciences."
    },
    {
      id: 2,
      name: "University of Oxford",
      country: "United Kingdom",
      location: "Oxford, England",
      website: "https://www.ox.ac.uk",
      deadline: "October 15, 2025",
      deadlineType: "UCAS Application",
      requirements: [
        "UCAS application",
        "Academic transcripts and predicted grades",
        "Personal statement",
        "Academic reference",
        "Admissions test (varies by course)",
        "Written work (for some courses)"
      ],
      allowedCountries: "All countries",
      description: "One of the world's oldest universities with collegiate system and tutorial-based learning."
    },
    {
      id: 3,
      name: "Stanford University",
      country: "United States",
      location: "Stanford, California",
      website: "https://www.stanford.edu",
      deadline: "January 5, 2026",
      deadlineType: "Regular Decision",
      requirements: [
        "Common Application or Coalition Application",
        "SAT/ACT scores (optional)",
        "High school transcript",
        "Two letters of recommendation",
        "School report",
        "Application fee ($90) or fee waiver"
      ],
      allowedCountries: "All countries",
      description: "Leading research university in Silicon Valley with strong entrepreneurship culture."
    },
    {
      id: 4,
      name: "ETH Zurich",
      country: "Switzerland",
      location: "Zurich, Switzerland",
      website: "https://ethz.ch",
      deadline: "April 30, 2026",
      deadlineType: "Fall Semester",
      requirements: [
        "Online application form",
        "High school diploma or equivalent",
        "Proof of language proficiency (German for most programs)",
        "Academic transcripts",
        "Passport copy",
        "Application fee (CHF 150)"
      ],
      allowedCountries: "All countries",
      description: "Premier technical university specializing in engineering, science, and technology."
    },
    {
      id: 5,
      name: "National University of Singapore",
      country: "Singapore",
      location: "Singapore",
      website: "https://www.nus.edu.sg",
      deadline: "March 15, 2026",
      deadlineType: "International Applicants",
      requirements: [
        "Online application",
        "High school qualifications (A-Levels, IB, etc.)",
        "English proficiency test (TOEFL/IELTS)",
        "Personal statement",
        "Certificates and transcripts",
        "Application fee (SGD 20)"
      ],
      allowedCountries: "All countries",
      description: "Asia's leading global university with comprehensive multidisciplinary programs."
    },
    {
      id: 6,
      name: "University of Toronto",
      country: "Canada",
      location: "Toronto, Ontario",
      website: "https://www.utoronto.ca",
      deadline: "January 15, 2026",
      deadlineType: "International Applicants",
      requirements: [
        "OUAC application",
        "High school transcripts",
        "English proficiency test (if applicable)",
        "Supplementary application (program-specific)",
        "Video interview (for some programs)",
        "Application fee (CAD 156)"
      ],
      allowedCountries: "All countries",
      description: "Canada's top university with three campuses offering diverse academic programs."
    },
    {
      id: 7,
      name: "University of Melbourne",
      country: "Australia",
      location: "Melbourne, Victoria",
      website: "https://www.unimelb.edu.au",
      deadline: "May 31, 2026",
      deadlineType: "International Students",
      requirements: [
        "Online application",
        "Academic transcripts and certificates",
        "English language proficiency (IELTS/TOEFL)",
        "Personal statement",
        "Portfolio (for creative programs)",
        "No application fee"
      ],
      allowedCountries: "All countries",
      description: "Australia's premier research university with strong global rankings."
    },
    {
      id: 8,
      name: "Technical University of Munich",
      country: "Germany",
      location: "Munich, Germany",
      website: "https://www.tum.de",
      deadline: "May 31, 2026",
      deadlineType: "Winter Semester",
      requirements: [
        "Uni-Assist application (for most programs)",
        "University entrance qualification",
        "Proof of German language (TestDaF/DSH) or English",
        "Academic transcripts",
        "Curriculum vitae",
        "Letter of motivation"
      ],
      allowedCountries: "All countries (EU & non-EU)",
      description: "Top German technical university with excellence in engineering and natural sciences."
    },
    {
      id: 9,
      name: "Tsinghua University",
      country: "China",
      location: "Beijing, China",
      website: "https://www.tsinghua.edu.cn",
      deadline: "March 31, 2026",
      deadlineType: "International Students",
      requirements: [
        "Online application system",
        "High school diploma and transcripts",
        "Chinese language proficiency (HSK) or English",
        "Personal statement",
        "Two recommendation letters",
        "Application fee (CNY 800)"
      ],
      allowedCountries: "All countries",
      description: "China's leading university with strength in engineering and technology."
    },
    {
      id: 10,
      name: "Sorbonne University",
      country: "France",
      location: "Paris, France",
      website: "https://www.sorbonne-universite.fr",
      deadline: "March 31, 2026",
      deadlineType: "Campus France Application",
      requirements: [
        "Campus France procedure",
        "Academic transcripts",
        "French language proficiency (DELF/DALF) or English",
        "Motivation letter",
        "CV",
        "Application fee (varies)"
      ],
      allowedCountries: "All countries",
      description: "Historic French university with strong humanities, sciences, and medical programs."
    }
  ];

  const countries = ['all', ...new Set(universities.map(u => u.country))];

  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           uni.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = selectedCountry === 'all' || uni.country === selectedCountry;
      const matchesDeadline = selectedDeadline === 'all' || 
                             (selectedDeadline === 'before-march' && new Date(uni.deadline) < new Date('2026-03-01')) ||
                             (selectedDeadline === 'after-march' && new Date(uni.deadline) >= new Date('2026-03-01'));
      
      return matchesSearch && matchesCountry && matchesDeadline;
    });
  }, [searchTerm, selectedCountry, selectedDeadline]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Top Universities</h1>
          <p className="text-gray-600">Find your dream university from around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country === 'all' ? 'All Countries' : country}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedDeadline}
                onChange={(e) => setSelectedDeadline(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Deadlines</option>
                <option value="before-march">Before March 2026</option>
                <option value="after-march">After March 2026</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredUniversities.length} of {universities.length} universities
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUniversities.map(uni => (
            <div key={uni.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                <h2 className="text-2xl font-bold text-white mb-1">{uni.name}</h2>
                <div className="flex items-center text-blue-100 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{uni.location}</span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">{uni.description}</p>

                {/* Website Link */}
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Visit Official Website
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>

                {/* Deadline */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-semibold text-yellow-800">Application Deadline</p>
                      <p className="text-yellow-700">{uni.deadline} ({uni.deadlineType})</p>
                    </div>
                  </div>
                </div>

                {/* Allowed Countries */}
                <div className="bg-green-50 border-l-4 border-green-400 p-3 mb-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-800">Eligible Countries</p>
                      <p className="text-green-700">{uni.allowedCountries}</p>
                    </div>
                  </div>
                </div>

                {/* Application Requirements */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-800 mb-2">Application Requirements</p>
                      <ul className="space-y-1">
                        {uni.requirements.map((req, idx) => (
                          <li key={idx} className="text-blue-700 text-sm flex items-start">
                            <span className="mr-2">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No universities found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCountry('all');
                setSelectedDeadline('all');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExploreUniversities;