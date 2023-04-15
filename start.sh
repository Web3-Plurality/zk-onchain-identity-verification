if [ "$1" == "up" ]; then

    cd govt-vc-issuer/
    ACAPY_ENDPOINT=$ACAPY_ISSUER_ENDPOINT docker-compose -f docker-compose.yml up -d
    cd ../dapp-verifier/vc-verifier-service/
    ACAPY_ENDPOINT=$ACAPY_VERIFIER_ENDPOINT docker-compose -f docker-compose.yml up -d
    cd ../verifier-app/
    docker-compose up -d

elif [ "$1" == "down" ]; then

    cd govt-vc-issuer/
    docker-compose down
    cd ../dapp-verifier/vc-verifier-service/
    docker-compose down
    cd ../verifier-app/
    docker-compose down

else

	echo "Please provide param (up or down)"

fi