--cloning
git clone https://github.com/PalermoJ12/Cocogen.git

--
npm install
composer install && composer update

--migration
php artisan migrate
php artisan db:seed

--running
-open first cmd/bash/powershell
php artisan serve
-open second cmd/bash/powershell
npm run dev

--default account
email: test@example.com
password: password
